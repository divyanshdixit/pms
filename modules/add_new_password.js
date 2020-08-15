var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://divyansh:devilme96@@cluster0.svob2.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

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