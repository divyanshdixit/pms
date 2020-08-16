var express = require('express');
var router = express.Router();
var passCatModel = require('../modules/password_category');
var passCatFind = passCatModel.find({}, {'password_category':1, '_id':1});

router.get('/categorylist', function(req, res, next){
    // res.send('Node js rest api');
    passCatFind.exec((err, data) => {
        if(err) throw err;
        res.status(200).json({
            message:'Success',
            data:data
        })
        // res.send(data);
        // res.render('passwordCategory', {projectName:projectName, title:'Password Cateogry List', data:data, success:''});
      });
})

router.post('/add-category', function(req, res , next){
    var passCatVal = req.body.pass_cat;
    var newPassCat = new passCatModel({
        password_category:passCatVal
    })
    newPassCat.save((err, doc)=>{
        if(err) throw err;
        res.status(201).json({
            message:"inserted",
            data:doc
        })
    })
    
});

// in put method we sent all table field data for update one column value 
// with parameter (id)
router.put ('/add-update-category/:id', function(req, res , next){
    var id = req.params.id;
    var passCat = req.body.pass_cat;

    passCatModel.findById(id, (err, data) => {
        if(err) throw err;
        data.password_category = passCat ? passCat : data.password_category;
        data.save( (err, doc) => {
            if(err) throw err;
            res.status(200).json({
                message:"Updated sucessfully",
                data:doc
            })
            // res.send('node js put method add and update rest api working')
        })
    })
})

//  patch method is more efficient for update bcz we only sent data which we want to update
// without parameter 
router.patch('/update-category', function(req, res , next){
   
    var id = req.body.id;
    var passCat = req.body.pass_cat;

    passCatModel.findById(id, (err, data) => {
        if(err) throw err;
        data.password_category = passCat ? passCat : data.password_category;
        data.save( (err, doc) => {
            if(err) throw err;
            res.status(200).json({
                message:"Updated sucessfully",
                data:doc
            })
            // res.send('node js PATCH method add and update rest api working')
        })
    })
})

router.delete('/delete-category', function(req, res , next){
    var _id = req.params.id; // id as parameter
    var id = req.body.id; // id in body
    var deletePassCat = passCatModel.findByIdAndDelete(id, (err, data) => {
        if(err) throw err;
        res.status(200).json({
            message:`Deleted successfully`,
            id:id
        })
        // res.send('node js DELETE method delete rest api working')
    })
    
})

module.exports = router;