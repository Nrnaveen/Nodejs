/*Generic require login routing middleware */
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require("./config");

exports.requiresLogin = function(req, res, next) {
      if (!req.isAuthenticated()) {
           return res.redirect("/login");
      }else if(req.isAuthenticated() && req.user.role == 'admin') {
           return res.redirect("/login");
      }
      return next();
};
exports.requiresNotLogin = function(req, res, next) {
      if(req.isAuthenticated() && req.user.role == 'user') {
           return res.redirect("/");
      }
      return next();
};
exports.requiresAdminLogin = function(req, res, next) {
      if (!req.isAuthenticated()) {
           return res.redirect("/admin/login");
      }else if(req.isAuthenticated() && req.user.role != 'admin') {
           return res.redirect("/admin/login");
      }
      return next();
};
exports.requiresAdminNotLogin = function(req, res, next) {
      if (req.isAuthenticated() && req.user.role == 'admin') {
           return res.redirect("/admin");
      }
      return next();
};
/* User authorizations routing middleware */
exports.user = {
      hasAuthorization: function(req, res, next) {
           if (req.profile.id != req.user.id) {
                return res.redirect("/");
           }
           return next();
      }
};
exports.authorize = {
      isAuthorized: function (req, res, next) {
           var token = req.headers.auth_token;
           if(typeof token != 'undefined') {
                var decode = jwt.decode(token, config.secret_token);
                if(decode.exp <= moment().valueOf()) {
                     return res.redirect("/");
                }
           }else{
                return res.redirect("/");
           }
           return next();
      }
};