var mongoose = require('mongoose');

require('dotenv').config()

mongoose.connect(process.env.LIVE_DB_URL, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

var conn = mongoose.Connection;

var passcatSchema = new mongoose.Schema({
    password_category: {
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// creating a model using schema

var passcatModel = mongoose.model('password_categories', passcatSchema);

module.exports = passcatModel;

