var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_new_password');
var passCatFind = passCatModel.find({});
var passFind = passModel.find({});
var bcryptjs = require('bcryptjs');
const userModel = require('../modules/user');
var jsonWebToken = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

if(typeof localStorage === 'undefined' || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var projectName = "Password Management System";

// middleware function for checking and showing mess for duplicate email

  function checkEmail(req, res , next){
    var email = req.body.email
    var existingEmail = userModule.findOne({email:email});
    existingEmail.exec((err, result) => {
      if(err) throw err;
      if(result){
        return res.render('signup', {title:'Signup Form', projectName:projectName, msg:'Email already exists'});    
      }
      // if error is not present then it'll move to next
      next();
    })
  }

  // middleware function for checking duplicate username

  function checkUsername(req, res, next){
    var username = req.body.usermame;
    var existingUsername = userModule.findOne({username:username});
    existingUsername.exec( (err, data) => { 
      if(err) throw err;
      if(data){
       return res.render('signup', {title:'Signup Form', projectName:projectName, msg:'Username already exists'});
      }
      // if error is not present then it'll move to next
      next();
    })

  }

  // middleware function for verify user after login before access the pages
  function checkLoginUser(req, res , next){
    var userToken = localStorage.getItem('userToken');
    
    try{
      var verifyToken = jsonWebToken.verify(userToken, 'loginToken');
    
    }catch(err){
      res.redirect('/');
    }
    next();
  }

/* login page get route */  
router.get('/',  function(req, res, next) {
  var loggedInUser = localStorage.getItem('loginUser');
  
  if(loggedInUser){
    res.redirect('/dashboard');
  }else{
    res.render('index', { projectName: projectName, title: 'Login Form', msg:'' });
  }
});


// login page post route => redirect to dashboard page 

  router.post('/', function(req, res, next){
    var loginUsername = req.body.username
    var loginPassword = req.body.password

    var getUsername = userModel.findOne({username:loginUsername});
    getUsername.exec(function(err, result){
      if(err) throw err;
      if(result){
        var getUserId = result._id;
        var getUserPassword = result.password
        if(bcryptjs.compareSync(loginPassword, getUserPassword)){
            // create token 
            var token = jsonWebToken.sign({userId:getUserId}, 'loginToken');
              localStorage.setItem('userToken', token);
              localStorage.setItem('loginUser', loginUsername);

              res.redirect('/dashboard');
        }else{
          return res.render('index', { projectName: projectName, title: 'Login Form', msg:'Login Failed! Password is wrong, Please check it!' });
        }
      }else{
        return res.render('index', { projectName: projectName, title: 'Login Form', msg:'Login Failed! Wrong Username, Please check it!' })
      }
      next();
    })
    
  })

  setTimeout(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
  }, 60*60*1000);

// singup page get route
  router.get('/signup',  function(req, res, next){
    var loggedInUser = localStorage.getItem('loginUser');
    if(loggedInUser){
      res.redirect('/dashboard');
    }else{
      res.render('signup', {title:'Signup Form', projectName:projectName, msg:''})
    }
    
  });

  // signup page post route
  router.post('/signup', checkUsername, checkEmail, function(req,res, next){
    var username = req.body.username;
    var email = req.body.email
    var password = req.body.password
    var cpassword = req.body.conf_password
    // var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, 10);

    if(!bcryptjs.compareSync(cpassword, hash)){
      res.render('signup', {title:'Signup Form', projectName:projectName, msg:'Password not matched'});
    }else{
      
    var userDetails = new userModule({
      username:username,
      email:email,
      password:hash
    })

    userDetails.save( function(err, data) {
      if(err) throw err;
      res.render('signup', {title:'Signup Form', projectName:projectName, msg:'User registered successfully'})
    });
  }
  
  })
  
  // logout 

  router.get('/logout', function(req, res , next){
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
  })

module.exports = router;
