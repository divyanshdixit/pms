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

 // route for add new password form
 router.get('/', checkLoginUser, function(req, res , next){
    passCatFind.exec((err, data) => {
      if(err) throw err;
    res.render('addNewPassword', {projectName:projectName, title:'Add Password Form', data:data, success:''});
    });
  })

  // route for add new password form
  router.post('/', checkLoginUser, function(req, res , next){
    var newPassDetails = new passModel({
      password_category:req.body.pass_cat,
      project_name:req.body.project_name,
      password_description:req.body.pass_description
    });

    newPassDetails.save((err, data)=>{
       if(err) throw err;
       passCatFind.exec((err, doc) => {
        if(err) throw err;
       res.render('addNewPassword', {projectName:projectName, title:'Add Password Form', data:doc, success:'Password added successfully!'});
    })
  });
    
  })

  module.exports = router;
