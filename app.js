var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
require("dotenv").config();

const jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth.route');
const memberRouter = require('./routes/member.route');
const brandRouter = require('./routes/brand.route');
const adminPerfumeRouter = require('./routes/adminPerfume.route');


const connectDB = require('./config/db');

var app = express();

connectDB()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout", "layouts/layout");

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware thiết lập biến toàn cục cho EJS (locals)
app.use(function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.isAuthenticated = true;
      res.locals.isAdmin = decoded.isAdmin;
    } catch (err) {
      res.locals.isAuthenticated = false;
      res.locals.isAdmin = false;
    }
  } else {
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;
  }
  next();
});
// ==========================================

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/members', memberRouter);
app.use('/brands', brandRouter);
app.use('/admin/perfumes', adminPerfumeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
