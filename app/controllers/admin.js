var underscore = require('underscore');
var nodemailer = require('nodemailer');
var validator = require('validator');
var hbs = require('nodemailer-express-handlebars');
var moment = require('moment');
var crypto = require('crypto');
var lodash = require('lodash');
var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var config = require("../config/config");
var resetForm = require('../forms/resetPassword');
var db = require('../config/sequelize');

exports.getAdmin = function(req, res, next) {
	 res.render('admin/view/index.html', { title: config.app.name });
};
exports.getLogin = function(req, res, next) {
	 res.render('admin/view/login.html', { title: config.app.name+' - Login' });
};
exports.postLogin = function(req,res) {
	 req.flash('success', 'You Are Logged In Successfully');
      res.redirect('/admin');
};
exports.getChangepwd = function(req, res) {
	res.render('admin/view/resetPassword.html', { title: 'Reset Password', resetPasswordForm: resetForm.resetPassword });
};
exports.postChangepwd = function(req, res) {
     	var data = req.body;
     db.user.find({ where: { id: req.user.id } }).success(function(user) {
           if (user) {
                var password = user.encryptPassword(data.password);
                db.user.update({ password: password, }, { id: req.user.id }).success(function () {
                     req.flash('success', 'Your Password Successfully Changed');
                     res.redirect('/admin');
                }).error(function(err) {
                     req.flash('error', err.message);
                     res.redirect('/admin');
                });
           } else {
		      req.flash('error', "User Not Found");
                res.redirect('/admin');
           }
	}).error(function(err) {
           req.flash('error', "User Not Found");
           res.redirect('/admin');
	});
};

exports.getProfile = function(req, res) {
      res.render('admin/view/profile.html', { title: 'Profile', user: req.user });
};

exports.postProfile = function(req, res) {
      if(req.files && req.files.image.originalFilename){
           var image = req.files.image;
           var originalExtension = path.extname(image.originalFilename);
           var originalFilename = path.basename(image.originalFilename, originalExtension);
           var extension = ['.jpg','.jpeg','.png','.JPG'];
           if(extension.indexOf(originalExtension) >= 0) {
                var upload = path.join(__dirname, '../../public/uploads/');
                var file = moment().format("YYYYMMDDHHmmss")+'-' + image.originalFilename;
                gm(image.path).write( upload + file, function(err) {
                     if (err) {
                           req.flash('error', err.message);
                           return res.redirect('/admin/profile');
                     }else{
                           db.user.update({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                image: file,
                          }, { id: req.user.id }).success(function () {
                                req.flash('success', 'Profile updated successfully!');
                                res.redirect('/admin/profile');
                          }).error(function(err) {
                                req.flash('error', err.message);
                                res.redirect('/admin/profile');
                          });
                     }
                });
           }else{
                req.flash('error', "Please upload Only Image With Extension jpg,png");
                return res.redirect('/admin/profile');
           }
      }else{
           db.user.update({
                firstname: req.param("firstname"),
                lastname: req.param("lastname"),
           }, { id: req.user.id }).success(function () {
                req.flash('success', 'Profile updated successfully!');
                res.redirect('/admin/profile');
           }).error(function (err) {
                req.flash('error', err.message);
                res.redirect('/admin/profile');
           });
      }
};


exports.getUsers = function(req, res) {
      limit = 10;
      page = req.param('page') || 0;
      offset = page * limit;
      db.user.count({
           where: { role: 'user' },
      }).success(function(count) {
           var page_count = Math.ceil(count/limit) || 1;
           pages = lodash.range(page_count);
           db.user.findAll({
                limit: limit,
                offset: offset,
                where: { role: 'user' }
           }).success(function(superusers) {
                return res.render('admin/view/user.html',{ users: superusers, pages: pages, current_page: parseInt(page),total: page_count, });
           }).error(function(err) {
                return res.render('admin/view/user.html',{ users: []});
           });
      }).error(function(err) {
           return res.render('admin/view/user.html',{ users: []});
      });
};

exports.getDeleteUser = function(req, res) {
      db.user.find({ where: { id: req.param('id'), role: 'user' } }).success(function(superuser) {
           if(superuser) {
                superuser.destroy().then(function() {
                     req.flash('success', 'User deleted successfully');
                     return res.redirect('/admin/users');
                }).catch(function(err) {
                     req.flash('error', err.message);
                     return res.redirect('/admin/users');
                });
           }
      }).error(function(err) {
           req.flash('error', err.message);
           return res.redirect('/admin/users');
      });
}; 

exports.getEditUser = function(req, res) {
      db.user.find({ where: { id: req.param('id') } }).success(function(row) {
           if(row) {
                return res.render('admin/view/user_edit.html',{ row: row });
           }else{
                req.flash('error', "User Not Found");
                res.redirect("/admin");
           }
      }).error(function(err) {
           req.flash('error', err.message);
           res.redirect("/admin");
      });
};

exports.postEditUser = function(req, res) {
      db.user.update({
           firstname: req.param("firstname"),
           lastname: req.param("lastname"),
      }, { id: req.param('id') }).success(function () {
           req.flash('success', 'Profile updated successfully!');
           res.redirect('/admin/users');
      }).error(function(err) {
           req.flash('error', err.message);
           res.redirect('/admin/users');
      });
};

exports.getChangePassword = function(req, res) {
      db.user.find({ where: { id: req.param('id') } }).success(function(row) {
           if(row) {
                return res.render('admin/view/resetPassword.html', { title: 'Reset Password', resetPasswordForm: resetForm.resetPassword });
           }else{
                req.flash('error', "User Not Found");
                res.redirect("/admin");
           }
      }).error(function(err) {
           req.flash('error', err.message);
           res.redirect("/admin");
      });
};
exports.postChangePassword = function(req, res) {
      var data = req.body;
      db.user.find({ where: { id: req.param('id') } }).success(function(user) {
           if (user) {
                var password = user.encryptPassword(data.password);
                db.user.update({ password: password, }, { id: req.param('id') }).success(function () {
                     req.flash('success', 'Your Password Successfully Changed');
                     res.redirect('/admin/users');
                }).error(function(err) {
                     req.flash('error', err.message);
                     res.redirect('/admin/users');
                });
           } else {
                req.flash('error', "User Not Found");
                res.redirect('/admin/users');
           }
  }).error(function(err) {
           req.flash('error', "User Not Found");
           res.redirect('/admin/users');
  });
};


exports.getSignout = function(req, res) {
      req.logout();
      req.flash('success', 'You Are Logged Out Successfully');
      res.redirect('/admin');
};