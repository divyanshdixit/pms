var express = require('express');
var router = express.Router();
var productModel = require('../modules/product');
var productFind = productModel.find({});
var auth = require('./middleware/auth');
var productController = require('./controller/productController');

// var mongoose = require('mongoose');
var multer =  require('multer');
var diskStorage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './public/uploads')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({storage:diskStorage});

router.get('/getAllProducts', auth, productController.getAllProductData )

// While uploading image we need 3 things => 1) Image path 2) image size limit 3) image extension limit
router.post('/add', upload.single('productImage'), auth, productController.addProduct)

router.patch('/update', function(req, res, next){
    var id = req.body.id
    var name = req.body.name

    productModel.findById(id,(err, data)=>{
        if(err) throw err;
        data.name = name ? name : data.name;
        data.save()
        .then(doc => {
            res.status(201).json({
                message:'Updated',
                data:doc
            })
        })
        .catch(err => {
            res.json(err)
        }) 
    })
})

router.delete('/delete', function(req, res, next){
    var id = req.body.id

    productModel.findByIdAndDelete(id)
    .then(doc => {
        res.status(200).json({
            message:'Deleted',
            data:doc
        })
    })
    .catch(err=>{
        res.json(err);
    })
})

module.exports = router;