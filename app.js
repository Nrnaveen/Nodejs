var express = require('express');
var app = express();

require('./app/config/express')(app, express);

module.exports = app;