var productModel = require('../../modules/product');
var productFind = productModel.find({})

exports.getAllProductData = function(req, res, next){
    productFind.exec()
    .then(doc => {
        res.status(200).json({
            message:"OK",
            data:doc
        })
    })
    .catch(err => {
        res.json(err);
    })
}

exports.addProduct = function(req, res, next){
    var name = req.body.name
    var quantity = req.body.quantity
    var price = req.body.price

    console.log(req.file, req.decodeData);

    var newProduct = new productModel({
        name:name,
        quantity:quantity,
        price:price
    })

    newProduct.save()
    .then(doc => {
        res.status(201).json({
            message:'Created',
            data:doc
        })
    })
    .catch(err => {
        res.json(err)
    })
}