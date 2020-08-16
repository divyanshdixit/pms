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

 // route for the category list 
 router.get('/', checkLoginUser, function(req, res , next){
    passCatFind.exec((err, data) => {
      if(err) throw err;
      res.render('passwordCategory', {projectName:projectName, title:'Password Cateogry List', data:data, success:''});
    });
  })

  // delete route for password category
  router.get('/delete/:id', checkLoginUser, function(req, res , next){
    
    passCatModel.findByIdAndDelete(req.params.id, (err, result) => {
      if(err) throw err;
      if(result){
        passCatFind.exec((err, data) => {
          if(err) throw err;
          res.render('passwordCategory', {projectName:projectName, title:'Password Cateogry List', data:data, success:'Category deleted successfully'});
      })
    }
  })
})

  // get edit route for password category 
  router.get('/edit/:id', checkLoginUser, function(req, res , next){
    passCatModel.findById(req.params.id, (err, data) => {
      if(err) throw err;
      res.render('passwordCategoryEdit', {projectName:projectName, title:'Password Cateogry Edit', data:data, success:'', errors:''})
    })
  })

  // post edit route for password category
  router.post('/edit', checkLoginUser, function(req, res , next){
    passCatModel.findByIdAndUpdate(req.body.id, {password_category:req.body.category_name}, (err, data) => {
      if(err) throw err;
      if(data){
        res.redirect('/passwordcategory');
        // res.render('passwordCategoryEdit', {projectName:projectName, title:'Password Cateogry Edit', success:'', errors:''})
      }
      
    })
  })
  
  module.exports = router;
