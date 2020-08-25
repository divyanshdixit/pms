var createError = require('http-errors');	
var express = require('express');	
var fs = require('fs');	
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
var zipRouter = require('./routes/getZip')	
var emailRouter = require('./routes/sendEmail')	
var addCatAPI = require('./apis/add-category');	
var productAPI = require('./apis/product');	
var userAPI = require('./apis/user');	
var dotenv = require('dotenv').config();	

var app = express();	
// var http = require('http').Server(app)	
// var io = require('socket.io')(http);	

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
app.use('/getzip', zipRouter )	
app.use('/sendemail', emailRouter )	
app.use('/api', addCatAPI )	
app.use('/api', productAPI )	
app.use('/userapi', userAPI )	

app.get('/chat', function(req, res){	
  res.render('getUsername', {title:'Chat Web App', projectName:'Chat Feature- Password Management System'})	
})	



// io.on('connection', function(socket){	
//   console.log('User is connected!');	
//   connectedUser++;	

//   socket.on('setusername', function(data){	
//     if(users.indexOf(data) > -1){	
//       socket.emit('userExists', data + ' Username is already taken. Please choose other.')	
//     }else{	
//       users.push(data);	
//       socket.emit('userSet', {username:data, usernumber:users.length})	
//     }	
//   })	

//   socket.on('msg', function(data){	
//     io.sockets.emit('newmsg', data)	
//   })	

//   socket.on('disconnect', function(){	
//     console.log('User is disconnected!');	
//     connectedUser--;	

//   })	
// })	

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

// http.listen(5000, function(){	
//   console.log('Server is running on posrt 5000');	
// })	

module.exports = app;