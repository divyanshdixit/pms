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

router.get('/dashboard', checkLoginUser , function(req, res, next) {
  var loggedInUser =  localStorage.getItem('loginUser');
  res.render('dashboard', { projectName: projectName, title: 'User Dashboard', loginUser:loggedInUser, msg:'' });
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

  // route for the category list 
  router.get('/passwordcategory', checkLoginUser, function(req, res , next){
    passCatFind.exec((err, data) => {
      if(err) throw err;
      res.render('passwordCategory', {projectName:projectName, title:'Password Cateogry List', data:data, success:''});
    });
  })

  // delete route for password category
  router.get('/passwordcategory/delete/:id', checkLoginUser, function(req, res , next){
    
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
  router.get('/passwordcategory/edit/:id', checkLoginUser, function(req, res , next){
    passCatModel.findById(req.params.id, (err, data) => {
      if(err) throw err;
      res.render('passwordCategoryEdit', {projectName:projectName, title:'Password Cateogry Edit', data:data, success:'', errors:''})
    })
  })

  // post edit route for password category
  router.post('/passwordcategory/edit', checkLoginUser, function(req, res , next){
    passCatModel.findByIdAndUpdate(req.body.id, {password_category:req.body.category_name}, (err, data) => {
      if(err) throw err;
      if(data){
        res.redirect('/passwordcategory');
        // res.render('passwordCategoryEdit', {projectName:projectName, title:'Password Cateogry Edit', success:'', errors:''})
      }
      
    })
  })

  // route for add new category form
  router.get('/addnewpasswordcategory', checkLoginUser, function(req, res , next){
    res.render('addNewCategory', {projectName:projectName, title:'Add Category Form', errors:'', success:''});
  })
  
  router.post('/addnewpasswordcategory', checkLoginUser, [
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
  
  // route for add new password form
  router.get('/addnewpassword', checkLoginUser, function(req, res , next){
    passCatFind.exec((err, data) => {
      if(err) throw err;
    res.render('addNewPassword', {projectName:projectName, title:'Add Password Form', data:data, success:''});
    });
  })

  // route for add new password form
  router.post('/addnewpassword', checkLoginUser, function(req, res , next){
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
  
  // route for the password list 
  router.get('/passwordlist', checkLoginUser, function(req, res , next){
    var perPage = 4;
    var page = req.params.page || 1;
    
    var getPasswordDetails = passModel.aggregate([ 
      {
        $lookup:{
          from:"password_categories",
          localField:"password_category",
          foreignFeild:"password_category",
          as:"pass_docs"
        }
      },
      {
        $unwind: "$pass_docs"
      }
    ]).skip( (perPage*page) - perPage).limit(perPage);
    // dataPerPage = dataPerPage+5;

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
  router.get('/passwordlist/:page', checkLoginUser, function(req, res , next){
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
  router.get('/passwordlist/edit/:id', checkLoginUser, function(req, res , next){
    passModel.findById(req.params.id, (err,data)=>{
      if(err) throw err;
      if(data)
        console.log(data);
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
  router.post('/editpassword', checkLoginUser, function(req, res , next){
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

  router.get('/passwordlist/delete/:id', checkLoginUser, function(req, res, next){
    passModel.findByIdAndDelete(req.params.id, (err, data)=>{
      if(err) throw err;
      if(data){
        res.redirect('/passwordlist');
        
      }
    })
  })

  // logout 

  router.get('/logout', function(req, res , next){
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
  })

module.exports = router;
