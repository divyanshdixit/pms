var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://divyansh:devilme96@@cluster0.svob2.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true});

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

