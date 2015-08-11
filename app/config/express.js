var nunjucks  = require('nunjucks');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var expressSession = require('express-session');
var errorhandler = require('errorhandler');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var dateFilter = require('nunjucks-date-filter');
var nunjucksDate = require('nunjucks-date');
var passport = require('./passport');
var routes = require('../routes/index');
var admin = require('../routes/admin');
var auth = require('../routes/auth');
var users = require('../routes/users');
module.exports = function(app, express) {
	var SECRET_KEY = 'Naveenr7+^!-xf)i1agch=^g_0%svl++wjo=z3x!gn%nq7+5mv7m_3h^Naveen';
	var client = redis.createClient();
	// view config
	nunjucksDate.setDefaultFormat('MMMM Do YYYY, h:mm:ss a');
	app.set('views', path.join(__dirname, '../views'));
	var env = nunjucks.configure(app.get('views'), { autoescape: true, express: app });
	env.addFilter('date', dateFilter);
	nunjucksDate.install(env);
	app.set('view engine', 'html');

	app.use(logger('dev'));
	app.use(bodyParser.json());
	// upload dir
	app.use(bodyParser.urlencoded({
		extended: true,
		uploadDir: '../../public/uploads'
	}));
	app.use(cookieParser());
	// resource path
	app.use(express.static(path.join(__dirname, '../../public')));
	// session config
	app.use(session({
		secret: SECRET_KEY,
		store: new RedisStore({ host: 'localhost', port: 6379, client: client }),
		proxy: true, resave: true, saveUninitialized: true,
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function (req, res, next) {
		res.locals.user = req.user;
		next();
	});
	// routes
	app.use('/', routes).use('/auth', auth).use('/admin', admin).use('/users', users).use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	}); // error handlers
	app.use(errorhandler({ log: errorNotification }));
	function errorNotification(err, str, req) {
		var title = 'Error in ' + req.method + ' ' + req.url;
		console.log(title+"\n"+str);
	}
	process.env.TZ = 'UTC';
};