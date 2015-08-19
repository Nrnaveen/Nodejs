var validator = require('validator');
var hbs = require('nodemailer-express-handlebars');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path');
var uuid = require('uuid');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var config = require("../config/config");
var db = require('../config/sequelize');
var resetForm = require('../forms/resetPassword');
var form = require('../forms/signup');
var passport = require('../config/passport');
var transporter = config.mail.nodemail;
transporter.use('compile', hbs(config.mail.options));

exports.getHome = function(req, res, next) {
      return res.render('front/views/index.html', { title: config.app.name });
};

exports.getLogin = function(req, res, next) {
      return res.render('front/views/login.html', { title: config.app.name+' - Login' });
};

exports.postLogin = function(req,res, next) {
      var data = req.body;
      db.user.find({ where: { email: data.email } }).success(function(user) {
           if(!user) {
                req.flash("error", "Invalid username or password."); 
                return res.redirect("/login");
           }else if(!user.active) {
                req.flash("error", "Please Confirm Your Mail.To Activate Account"); 
                return res.redirect("/login");
           }else{
                passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.', })(req, res, next);
           }
      }).error(function(err) {
           req.flash("error", "Invalid username or password."); 
           return res.redirect("/");
      });
};

exports.getActivate = function(req,res, next) {
      var token = req.param("token");
      db.user.find({ where: { token: token } }).success(function(user) {
           if(!user) {
                req.flash("error", "Invalid Token."); 
                return res.redirect("/login");
           }else{
                user.token = null;
                user.active = 1;
                user.save().success(function() {
                     req.flash('success', 'Your Account has been Activated');
                     return res.redirect('/login');
                }).error(function(err) {
                     req.flash('error', 'Token has been Expired');
                     return res.redirect('/login');
                });
           }
      }).error(function(err) {
           req.flash("error", "Invalid username or password."); 
           return res.redirect("/");
      });
};

exports.getSignup = function(req, res, next) {
      var name = req.query.type;
      return res.render('front/views/signup.html', { title: config.app.name+' - Signup', type : name, signupForm: form.signup_form });
};

exports.postSignup = function(req,res) {
      var data = req.body;
      form.signup_form.handle(req, {
           success: function (form) {
                if (form.isValid()){
                     db.user.find({where: {email: data.email}}).success(function(user) {
                          if(!user) {
                                var token = uuid.v4();
                                welcomeLink = config.app.baseUrl + "account/activate/" + token;
                                var user = db.user.build(data);
                                user.image = 'avatar.png';
                                user.provider = 'local';
                                user.active = 0;
                                user.token = token;
                                user.password = user.encryptPassword(data.password);
                                user.save().success(function() {
                                     var mailOptions = {
                                          from: 'Naveen Kumar <nrnaveen0492@gmail.com>', to: user.email, subject: 'Account was created for you',
                                          template: 'welcome', context: { url: config.app.baseUrl, welcomeLink: welcomeLink },
                                     };
                                     transporter.sendMail(mailOptions, function(error, info){
                                          console.log('Message sent: ' + info.response);
                                          req.flash("success", "You Are Successfully Registered.Please Confirm your mail to Active account.");
                                          return res.redirect('/login');
                                     });
                                });
                          }else{
                                req.flash("error", "Email ID is already registered.Please Select another one");
                                return res.redirect('/signup');
                          }
                     });
                }
           },
           error: function (form) {
                req.flash('errors', form.errors);
                return res.render('front/views/signup.html', { title: config.app.name+' - Signup', signupForm: form });
           },
           empty: function (form) {
                console.log("empty\n");
           }
      });
};

exports.getSignout = function(req, res) {
      req.logout();
      return res.redirect('/');
};

exports.getForgotPassword = function(req, res) {
      return res.render('front/views/forgotPassword.html', { title: 'Forgot Password', message: req.flash('message') });
};

exports.postForgotPassword = function(req, res) {
      var email = req.body.email;
      db.user.find({ where: { email: email, role: 'user' } }).success(function(user) {
           if (!user) {
                req.flash('error', 'It is not a registered email address');
                return res.redirect('/forgotpasswd');
           } else {
                token = crypto.randomBytes(20).toString('hex');
                resetPasswordLink = config.app.baseUrl + "resetpasswd/" + token;
                date = moment().add(1, 'day').format("YYYY-MM-DD HH:mm:ss");
                user.forgotPasswordToken = token;
                user.forgotPasswordReqTime = date;
                user.save().success(function(a) {
                     var mailOptions = {
                           from: 'Naveen Kumar <nrnaveen0492@gmail.com>', to: user.email, subject: 'Reset Password Link',
                           template: 'forgotpass', context: { url: config.app.baseUrl, resetLink: resetPasswordLink },
                     };
                     transporter.sendMail(mailOptions, function(error, info){
                           if(error){
                                console.log(error);
                           }else{
                                console.log('Message sent: ' + info.response);
                                req.flash("success", "We’ve sent you an email containing a link that will allow you to reset your password for the next 24 hours.<br>Please check your spam folder if the email doesn’t appear within a few minutes.");
                                return res.redirect("/");
                           }
                     });
                });
           }
      }).error(function(err) {
           return res.redirect("/");
      });
};

exports.getResetPassword = function(req, res) {
      token = req.param("token");
      var data = req.body;
      db.user.find({ where: { forgotPasswordToken: token } }).success(function(user) {  
           if (user) {
                if(moment() <= moment(user.forgotPasswordReqTime)) {
                     res.render('front/resetPassword.html', { title: 'Reset Password', resetPasswordForm: resetForm.resetPassword });
                } else {
                     user.forgotPasswordToken = null;
                     user.save().success(function() {
                           req.flash('success', 'Token has been Expired');
                           return res.redirect('/login');
                     }).error(function(err) {
                           return res.redirect('/login');
                     });
                }
           } else {
                req.flash('success', 'Token Not Found');
                return res.redirect('/login');
           }
    }).error(function(err) {
           return res.send('Error: token not found');
    });
};

exports.postResetPassword = function(req, res) {
      token = req.param("token");
      var data = req.body;
      db.user.find({ where: { forgotPasswordToken: token } }).success(function(user) {  
           if (user) {
                if(moment() <= moment(user.forgotPasswordReqTime)) {
                     user.password = user.encryptPassword(data.password);
                     user.forgotPasswordToken = null;
                     user.save().success(function() {
                           req.flash('success', 'Your Password Successfully Changed');
                           return res.redirect('/login');
                     }).error(function(err) {
                           return res.redirect('/login');
                     });
                } else {
                     user.forgotPasswordToken = null;
                     user.save().success(function() {
                           req.flash('success', 'Token has been Expired');
                           return res.redirect('/login');
                     }).error(function(err) {
                           return res.redirect('/login');
                     });
                }
           } else {
                req.flash('success', 'Token Not Found');
                return res.redirect('/login');
           }
      }).error(function(err) {
           return res.send('Error: token not found');
      });
};

exports.getChangepwd = function(req, res) {
      res.render('front/views/resetPassword.html', { title: 'Reset Password', resetPasswordForm: resetForm.resetPassword });
};

exports.postChangepwd = function(req, res) {
      var data = req.body;
      db.user.find({ where: { id: req.user.id } }).success(function(user) {
           if (user) {
                user.password = user.encryptPassword(data.password);
                user.save().success(function() {
                     req.flash('success', 'Your Password Successfully Changed');
                     return res.redirect('/');
                }).error(function(err) {
                     req.flash('success', 'User Not Found');
                     return res.redirect('/');
                });
           } else {
                return res.redirect('/login');
           }
      }).error(function(err) {
           return res.send('Error: token not found');
      });
};




exports.getRedirect = function(req, res) {
      return res.redirect("/");
};

exports.getDownload = function(req, res, next) {
      file = "public/report.pdf";
      res.download(file, 'naveen.pdf', function(err){
           if(err) {
                console.log(err);
           }
      });
};

exports.getMail = function(req,res) {
      var mailOptions = {
           from: 'Naveen Kumar <naveen@asareri.com>', to: 'nrnaveen0492@gmail.com', subject: 'Hello',
           template: 'test', context: { name: "Naveen Kumar", },
      };
      transporter.sendMail(mailOptions, function(error, info){
           if(error){
                console.log(error);
           }else{
                console.log('Message sent: ' + info.response);
           }
      });
      return res.redirect('/');
};

exports.getFile = function(req, res, next) {
      return res.render('front/views/file.html', { title: config.app.name+' - File Upload'});
};

exports.postFile = function(req, res, next) {
      var upload = path.join(__dirname, '../../public/uploads/');
      var image = req.files.image;
      originalExtension = path.extname(image.originalFilename);
      originalFilename = path.basename(image.originalFilename, originalExtension);
      var extension = ['.jpg','.jpeg','.png','.JPG'];
      if(extension.indexOf(originalExtension) >= 0) {
           gm(image.path).write( upload + ' original-' + image.originalFilename, function(err) {
                if (err) {
                     console.error(err);
                }
           });
           gm(image.path).resize(240, 240).write( upload + 'resize - ' + image.originalFilename, function(err) {
                if (err) {
                     console.error(err);
                }
           });
      }else{
           fs.rename(image.path, upload + image.originalFilename, function(err) {
                if (err)
                     throw err;
                console.error('renamed complete');
           });
      }
      return res.redirect('/');
};