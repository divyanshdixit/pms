var createError = require('http-errors');	
var express = require('express');	
var bodyParser = require('body-parser');
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
var fileUploadRouter = require('./routes/fileUploading')	
var geolocationRouter = require('./routes/geolocation')	
var addCatAPI = require('./apis/add-category');	
var productAPI = require('./apis/product');	
var userAPI = require('./apis/user');
const webpush = require('web-push');

var dotenv = require('dotenv').config();	

var app = express();	
// var http = require('http').Server(app)	
// var io = require('socket.io')(http);	

// view engine setup	
app.set('views', path.join(__dirname, 'views'));	
app.set('view engine', 'ejs');	

app.use(logger('dev'));	
app.use(bodyParser.json()); // for parsing application/json
app.use(express.json());	
app.use(express.urlencoded({ extended: true }));	
app.use(cookieParser());	
app.use('/fakepath',express.static(path.join(__dirname, 'public')));	
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
app.use('/file', fileUploadRouter)	
app.use('/geolocation', geolocationRouter)	
app.use('/api', addCatAPI )	
app.use('/api', productAPI )	
app.use('/userapi', userAPI )	


// for setting up the push 
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
// set the vapid details
webpush.setVapidDetails(
  'mailto:divyanshdixit96@gmail.com',
  publicVapidKey,
  privateVapidKey
);

let sub = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/cK4-9mY22ns:APA91bEYi9ZM7Uu0JTnCZgObgoXfnCqCnU6RPiYvTlOz15FduEx9MtUKZDHVBfgvxYkcmlh4yf9KqB1IVjmbHElvbK6lGzAjXjDHCFFt3yyYd56B6uIhQ5kKZyciyiHXXZl-T5V6gegr',
  expirationTime: null,
  keys: {
    p256dh: 'BI2Yip6KmzRZG7MnZiZLp6oKg5wwvPSGMJc-J2h39LoSmPpIWMxQeKKV4Rlw0bE_ZaSZ0Grmbz_oM656hjJGZHY',
    auth: 'OP3D7ZpqStjbcL_550kIAg'
  }
}
// webpush.sendNotification(sub, 'Test message')

app.get('/subscribe', (req, res) => {
  res.render('push-notification', {title:'Push Notifications', projectName:'PMS- Push Notifications'})
})

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log(subscription);

  /*
    subscription: {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dY8rDUMvF_M:APA91bFsdGywPoCBWsv408KzlJiB3Q7OOzvfsl4qn-cDNEi8E_B9paBem9mii8yFqRk_1oDnP-SjAn55peTVUZCYmUT6DSQHaEh__3wb61POiaQrdq9qPICQUqIBMYHvXHth2wsZaSo4',
  expirationTime: null,
  keys: {
    p256dh: 'BHEDfIgfWDijK0BMwepq0QG9VogB2dDi_WOC-I6dvDFyC7Z47mPTrYfO63dpwashTKn-yrpBYa-sz60Cxj5Mj6Y',
    auth: 'czD1HErTHXf8ooCNi0lKFA'
  }
}
  */
  res.status(201).json({
    'res':'Notification Generated and send'
  });

  const payload = JSON.stringify({
     title: 'Chat Message',
     body:'New Message!'
    });

  webpush.sendNotification(subscription, payload)
  .then(response => {
    console.log('Response:', response)
  })
  .catch(error => {
    console.error(error.stack);
  });
});


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