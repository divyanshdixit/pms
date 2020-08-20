var mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.LIVE_DB_URL, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

var conn = mongoose.Connection;

var schema = mongoose.Schema;

var productSchema = new schema({
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

var productModel = mongoose.model('products', productSchema)

module.exports = productModel;