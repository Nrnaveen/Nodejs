/*Generic require login routing middleware */

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