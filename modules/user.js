var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

var conn = mongoose.Connection;

var userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    email: {
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// creating a model using schema

var userModel = mongoose.model('Users', userSchema);

module.exports = userModel;

