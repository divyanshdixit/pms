var mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.LIVE_DB_URL, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

var conn = mongoose.Connection;

var locationSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    lat:{
        type:Number
    },
    long:{
        type:Number
    }
})

var locationModel = mongoose.model('location', locationSchema);

module.exports = locationModel;