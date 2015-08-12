var express = require('express');
var authorization = require('../config/authorization');
var passport = require('../config/passport');
var admin = require('../controllers/admin');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();

// GET admin page
router.route('/login')
	.get(authorization.requiresAdminNotLogin, admin.getLogin)
	.post(passport.authenticate('admin', { failureRedirect: '/admin/login', failureFlash: 'Invalid username or password.',  }), admin.postLogin);

router.get('/', authorization.requiresAdminLogin, admin.getAdmin);

router.route('/changepwd')
	.get(authorization.requiresAdminLogin, admin.getChangepwd)
	.post(authorization.requiresAdminLogin, admin.postChangepwd);

router.route('/profile')
	.get(authorization.requiresAdminLogin, admin.getProfile)
	.post(authorization.requiresAdminLogin, multipartMiddleware, admin.postProfile);

// users 
router.get('/users', authorization.requiresAdminLogin, admin.getUsers);

router.get('/users/delete/:id', authorization.requiresAdminLogin, admin.getDeleteUser);

router.route("/users/edit/:id")
	.get(authorization.requiresAdminLogin, admin.getEditUser)
	.post(authorization.requiresAdminLogin, admin.postEditUser);

router.route("/changepassword/users/:id")
	.get(authorization.requiresAdminLogin, admin.getChangePassword)
	.post(authorization.requiresAdminLogin, admin.postChangePassword);


router.get('/therapists/new', function(req, res) {
      models.Plan.findAll().then(function(plans) {
           models.User.findAll({ where: { role: 'supervisor' } }).then(function(superuser) {
                return res.render('super_admin/therapist_new.html',{ supervisors: superuser, plans: plans });
           }).catch(function(err) {
                req.flash('error', err.message+' !');
                res.redirect("/super_admin");
           });
      }).catch(function(err) {
           req.flash('error', err.message+' !');
           res.redirect("/super_admin");
      });
}).post('/therapists/new', function(req, res) {
      if(req.param('password') != req.param('confirm_password')) {
           req.flash('error', 'Password doesn\'t match');
           return res.render('super_admin/therapist_new.html',{ suser: req.body });
      }
      models.User.find({ where: { email: req.param('email') } }).then(function(user) {
           if(!user) {
                models.User.create({
                     first_name: req.param('first_name'),
                     last_name: req.param('last_name'),
                     email: req.param('email'),
                     password: req.param('password'),
                     role: 'therapist',
                     incharge: req.param('incharge'),
                }).then(function(user) {
                     var weekends = ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'];
                     var schedules = [];
                     var plans = req.param('plans');
                     plansData = [];
                     for(var plan in plans){
                           plansData.push({ userId: user.id, planId: parseInt(plans[plan]) });
                     }
                     for(var day in weekends){
                           status = (['sunday', 'saturday'].indexOf(weekends[day]) >= 0) ? false : true;
                           schedules.push({ userId: user.id, weekday: weekends[day], status: status, start: "08:00", end: "17:00" });
                     }
                     models.TravelTime.create({ userId: user.id, start: moment().format("YYYY-MM-DD"), end: moment().format("YYYY-MM-DD"), status: false });
                     models.Availability.bulkCreate( schedules ).then(function() {
                           models.UserPlan.bulkCreate( plansData );
                           req.flash('success', 'Therapist created successfully!');
                           res.redirect('/super_admin/therapists');
                     }).catch(function(err){
                           req.flash('error', 'Some thing Worng!');
                           res.redirect('/super_admin/therapists');
                     });
                }).catch(function(err){
                     req.flash('error', 'Some thing Worng!');
                     res.redirect('/super_admin/therapists');
                });
           }else{
                req.flash('error', 'Email is already Registered.Choose another email!');
                res.redirect('/super_admin/therapists');
           }
      }).catch(function(err){
           req.flash('error', 'Some thing Worng!');
           res.redirect('/super_admin/therapists');
      });
});















router.route('/logout').get(admin.getSignout);

module.exports = router;