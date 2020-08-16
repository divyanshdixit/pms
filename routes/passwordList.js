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

  // route for the password list 
  router.get('/', checkLoginUser, function(req, res , next){
    var perPage = 4;
    var page = req.params.page || 1;
    
    var getPasswordDetails = passModel.find({}).skip( (perPage*page) - perPage).limit(perPage);
    // dataPerPage = dataPerPage+5;
    // aggregate([ 
    //   {
    //     $lookup:{
    //       from:"password_categories",
    //       localField:"password_category",
    //       foreignFeild:"password_category",
    //       as:"pass_docs"
    //     }
    //   },
    //   {
    //     $unwind: "$pass_docs"
    //   }
    // ])
    getPasswordDetails.exec((err, data) => {
      if(err) throw err;
      if(data){
        passModel.countDocuments( (err, count) => {
          res.render('passwordList', {projectName:projectName, title:'Password List', data:data, success:'',
           current:page, pages: Math.ceil(count/perPage), count:count});
        })
        
      }
    })
  });

  // route for get data acc to page no
  router.get('/:page', checkLoginUser, function(req, res , next){
    var perPage = 4;
    var page = req.params.page || 1;
    var getPasswordDetails = passModel.find({}).skip( (perPage*page) - perPage).limit(perPage);
    // dataPerPage = dataPerPage+5;

    getPasswordDetails.exec((err, data) => {
      if(err) throw err;
      if(data){
        passModel.countDocuments({}, (err, count) => {
          if(err) throw err;
          if(count){
            res.render('passwordList', {projectName:projectName, title:'Password List', data:data, success:'',
           current:page, pages: Math.ceil(count/perPage), count:count});
          }
        })
        
      }
    })
  });

  // route for editing the password list 
  router.get('/edit/:id', checkLoginUser, function(req, res , next){
    passModel.findById(req.params.id, (err,data)=>{
      if(err) throw err;
      if(data)
      passCatFind.exec((err, response)=>{
        if(err) throw err;
        if(response){ 
          console.log(response)
          res.render('editPassword', {projectName:projectName, title:'Password List', data:data, response:response, success:''});    
        }
      })
      
    });
  });

  // post route for editing the password
  router.post('/edit', checkLoginUser, function(req, res , next){
    passModel.findByIdAndUpdate(req.body.id, {
      password_category:req.body.pass_cat,
      project_name:req.body.project_name,
      password_description:req.body.pass_description
    }, (err, data)=>{
      if(err) throw err;
      if(data){
        res.redirect('/passwordlist');
      }
    })
  });

  router.get('/delete/:id', checkLoginUser, function(req, res, next){
    passModel.findByIdAndDelete(req.params.id, (err, data)=>{
      if(err) throw err;
      if(data){
        res.redirect('/passwordlist');
        
      }
    })
  })

  module.exports = router;
