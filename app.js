var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var UserController = require('./api/controller/UserController');
var ProductController = require('./api/controller/ProductController');

var app = express();

const mongoose = require('mongoose');
// mongoose.connect('mongodb://172.16.0.66:27017/productapi');
mongoose.connect('mongodb://admin:admin@ds117878.mlab.com:17878/productapi');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

global.User = require('./api/model/User');
global.Product = require('./api/model/Product');
global.Config = require('./config');
global.JWT = require('./api/service/TokenService');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(UserController);
app.use(ProductController);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
