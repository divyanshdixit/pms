var express = require('express');
var router = express.Router();
var passCatModel = require('../modules/password_category');
var passCatFind = passCatModel.find({}, {'password_category':1});
var passModel = require('../modules/add_new_password');
var passFind = passModel.find({});

router.get('/getAllPassword', function(req, res, next){
    
    passModel.find({})
    .select('password_category project_name password_description')
    .populate('password_category')
    .exec()
    .then( doc => {
        res.json({
            message: 'OK',
            data:doc
        })
    })
    .catch(err => {
        res.json(err)
    })

})

router.get('/categorylist', function(req, res, next){
    // res.send('Node js rest api');
    // passCatFind.exec((err, data) => {
    //     if(err) throw err;
    //     res.status(200).json({
    //         message:'Success',
    //         data:data
    //     })
    //     // res.send(data);
    //     // res.render('passwordCategory', {projectName:projectName, title:'Password Cateogry List', data:data, success:''});
    //   });

    passCatFind.exec()
    .then( doc => {
        res.status(200).json({
            message: 'Fetched successfully',
            data:doc
        })
    })
    .catch( err => {
        res.json(err)
    })

})

router.post('/add-category', function(req, res , next){
    var passCatVal = req.body.pass_cat;
    var newPassCat = new passCatModel({
        password_category:passCatVal
    })
    // newPassCat.save((err, doc)=>{
    //     if(err) throw err;
    //     res.status(201).json({
    //         message:"inserted",
    //         data:doc
    //     })
    //     res.status(400).json({
    //         message:"Not Found"
    //     })
    // })

    // handle the error and success
    newPassCat.save()
    .then( doc => {
        res.status(201).json({
                    message:"inserted",
                    data:doc
                })
    })
    .catch(err => {
        res.json(err);
    }) // using promise
    
});

// in put method we sent all table field data for update one column value 
// with parameter (id)
router.put ('/add-update-category/:id', function(req, res , next){
    var id = req.params.id;
    var passCat = req.body.pass_cat;

    passCatModel.findById(id, (err, data) => {
        if(err) throw err;
        data.password_category = passCat ? passCat : data.password_category;
        // data.save( (err, doc) => {
        //     if(err) throw err;
        //     res.status(201).json({
        //         message:"Updated sucessfully",
        //         data:doc
        //     })
        //     // res.send('node js put method add and update rest api working')
        // })

        data.save()
        .then( doc => {
            res.status(201).json({
                message:"Updated sucessfully",
                data:doc
            })
        })
        .catch( err => {
            res.json(err);
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
        // data.save( (err, doc) => {
        //     if(err) throw err;
        //     res.status(200).json({
        //         message:"Updated sucessfully",
        //         data:doc
        //     })
        //     // res.send('node js PATCH method add and update rest api working')
        // })

        data.save()
        .then( doc => {
            res.status(200).json({
                message:"Updated patch sucessfully",
                data:doc
            })
        })
        .catch( err => {
            res.json(err);
        })
    })
})

router.delete('/delete-category', function(req, res , next){
    var _id = req.params.id; // id as parameter
    var id = req.body.id; // id in body
    
    // passCatModel.findByIdAndDelete(id, (err, data) => {
    //     if(err) throw err;
    //     res.status(200).json({
    //         message:`Deleted successfully`,
    //         id:id
    //     })
    //     // res.send('node js DELETE method delete rest api working')
    // })
    
    passCatModel.findByIdAndDelete(id)
    .then( doc => {
        res.status(200).json({
            message:`Deleted successfully`,
            data:doc
        })
    })
    .catch(err => {
        res.json(err);
    })

})

module.exports = router;