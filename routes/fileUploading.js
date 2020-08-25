var express = require('express');
var router = express.Router();

// use multer and path for uploading file and getting path for file
var multer = require('multer');
var path = require('path');

// create diskStorage for uploading the file
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        console.log(file)
        cb(null, './public/uploads')
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})

// creater multer middleware function
var upload = multer({
    storage: storage
}).array('myfile', 20);

router.get('/', function(req, res, next){
    res.render('fileupload', {title:'File Upload', projectName: 'PMS- File upload', success:''})
});

router.post('/upload', upload, function(req, res, next){
    res.send({'res':'success'})
    // upload(req, res, function(err){
    //     if(err){
    //         console.log(err);
    //         // res.send({'res':'err'})
    //         res.render('fileupload', {title:'File Upload', projectName: 'PMS- File upload', success:'Error'})
    //     }else{
    //         console.log(req.files, req.body)
    //         // res.send({'res':'success'})
    //         res.render('fileupload', {title:'File Upload', projectName: 'PMS- File upload', success:'success'})
    //     }
    // })

    // res.render('fileupload', {title:'File Upload', projectName: 'PMS- File upload', success:'success', filename:req.body.filename})

    // var success = req.file.filename + 'Uploaded Successfully!';
    
});

module.exports = router;