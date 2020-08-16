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

 // get route for add new category form
 router.get('/', checkLoginUser, function(req, res , next){
    res.render('addNewCategory', {projectName:projectName, title:'Add Category Form', errors:'', success:''});
  })
  
//   post route for adding new cateogry
  router.post('/', checkLoginUser, [
    // validation rules
    body('category_name', 'Enter password category name!').isLength({min:1})
  ], function(req, res , next){
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('addNewCategory', {projectName:projectName, title:'Add Category Form', errors:errors.mapped(), success:''});    
      }else{
        var passCatName = req.body.category_name;
        var passcatDetails = new passCatModel({
          password_category: passCatName
        })

        passcatDetails.save(function(err, data){
          if(err) throw err;
          res.render('addNewCategory', {projectName:projectName, title:'Add Category Form', errors:'', success:'Password category inserted succesfully!'});
        });

        
      }
    
  })
 
  
  module.exports = router;
