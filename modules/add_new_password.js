var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

var conn = mongoose.Connection;

var passSchema = new mongoose.Schema({
    password_category: {
        type:String,
        required:true,
    },
    project_name:{
        type:String,
    },
    password_description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// creating a model using schema

var passModel = mongoose.model('password_details', passSchema);

module.exports = passModel;