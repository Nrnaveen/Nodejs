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

router.route("/users/new")
	.get(authorization.requiresAdminLogin, admin.getNewUser)
	.post(authorization.requiresAdminLogin, admin.postNewUser);

router.route('/logout').get(admin.getSignout);

module.exports = router;