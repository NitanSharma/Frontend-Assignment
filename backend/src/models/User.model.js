const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minlength : [5, 'Email must be atleast 5 characters long'],
    },
    password : {
        type : String,
        required : true
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User