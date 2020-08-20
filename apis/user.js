/*
     for user registration 

     user name
     email
     password
      
*/

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var userModel = require('../modules/user');
const passModel = require('../modules/add_new_password');
var userFind = userModel.find({});
var jwt = require('jsonwebtoken');
var auth = require('./middleware/auth');

router.get('/getUser', function(req, res, next){

    userFind.exec()
    .then(doc => {
        res.status(200).json({
            message:'OK',
            data:doc
        })
    })
    .catch(err => {
        res.json(err);
    })

});

router.post('/signup', function(req, res, next){

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword

    // first check if password and confirm password is matching or not

    if(password !== cpassword){
        res.json({
            error:'Password and confirm password is not matching'
        })
    }else{
        // if both are matching then hash the password and save it with encrypt
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err){
                res.json({
                    message:"Something went wrong, Try again!",
                    error:err
                })
            }else{
                var newUser = new userModel({
                    username:username,
                   email:email,
                   password:hash 
                })

                newUser.save()
                .then(doc => {
                    res.status(201).json({
                        message:'Inserted',
                        data:doc
                    })
                })
                .catch(err => {
                    res.json({
                        message:'Error in inserting!',
                        error:err
                    })
                })
            }
        })
    }

})

router.post('/login', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    userModel.find({username:username})
    .exec()
    .then(user=>{
        if(user.length< 1){
            res.json({
                message:'Auth Failed',
            })
        }else{
            bcrypt.compare(password, user[0].password, function(err, result){
                if(err){
                    res.status(404).json({
                        message:'Auth faild! User Not found',
                    })
                }
                if(result){
                    var token = jwt.sign(
                        {
                            username:user[0].username,
                            userId:user[0]._id
                        },
                        'secretfixedkey',
                        {
                            expiresIn:"1h"
                        }
                     )
                    res.status(200).json({
                        message:'User Found',
                        token:token
                    })
                }else{
                    res.status(404).json({
                        message:'Auth failed! password not matched'
                    })
                }
            })
        }
    })
    .catch(err => {
        res.json({
            message:'User not found',
            error:err
        })
    });

})

module.exports = router;