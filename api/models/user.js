const { Email } = require('@mui/icons-material');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password:{
        type: String,
        min: 6,
        required: true
    },
    profilePic:{
        type: String,
        default: ""
    },
    coverPic:{
        type: String,
        default: ""
    },
    followers:{
        type: Array,
        default: []
    },
    following:{
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},
{timestamps:true});


module.exports = mongoose.model('User', userSchema);
