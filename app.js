var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var usersRouter = require('./routes/users');
var addNewPasswordCategoryRouter = require('./routes/addnewpasswordcategory');
var passwordCategoryListRouter = require('./routes/passwordCateogryList');
var addNewPasswordRouter = require('./routes/addNewPassword');
var passwordListRouter = require('./routes/passwordList');
var addCatAPI = require('./apis/add-category');
var productAPI = require('./apis/product');
var userAPI = require('./apis/user');
var dotenv = require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// use the session
app.use(session({
secret:'anything',
resave:false,
saveUninitialized:true,
cookie:{secure:true}
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/addnewpasswordcategory', addNewPasswordCategoryRouter )
app.use('/passwordcategory', passwordCategoryListRouter )
app.use('/addnewpassword', addNewPasswordRouter )
app.use('/passwordlist', passwordListRouter )
app.use('/api', addCatAPI )
app.use('/api', productAPI )
app.use('/userapi', userAPI )

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
