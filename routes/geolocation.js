var express = require('express');
var router = express.Router();
var locationModel = require('../modules/saveLocation');
var jsonWebToken = require('jsonwebtoken');
var locationFind = locationModel.find({});

if(typeof localStorage === 'undefined' || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
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

router.get('/', checkLoginUser, function(req, res, next){
    
    res.render('getlocation', {title:'title', projectName:'PMS- Geolocation'});    

})

router.post('/', checkLoginUser, function(req, res){
    var loggedInUser =  localStorage.getItem('loginUser');
    if(!loggedInUser || loggedInUser.length == 0){
        loggedInUser = "Anonymus User"
    }
    locationFind.exec( (err, doc) => {
        if(err) throw err;

        if(doc.name != loggedInUser){
            var locationDetails = new locationModel({
                name:loggedInUser,
                lat:req.body.lat,
                long:req.body.long
            })

            res.json({success:'<p> Thank you for your location! </p>', lat:req.body.lat, long:req.body.long})
        
            // locationDetails.save( (err, data) => {
            //     if(err) {
            //         res.json({error:err})
            //     }
            //     if(data){
            //         res.json({success:'<p> Thank you for your location! </p>', lat:req.body.lat, long:req.body.long})
            //     }
                
            // })
            
        }else{
            res.json({success:'<p> Thank you for your location! </p>', lat:req.body.lat, long:req.body.long})
        }
    })

    // res.send({'res':'sucess', lat:JSON.stringify(req.body.lat), long:JSON.stringify(req.body.long) });
  })


module.exports = router;