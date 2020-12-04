const mongoose  =  require('mongoose');

const userschema = mongoose.Schema({
    expire_at: {type: Date, default: Date.now, expires: 7200},

    username: {
        type: String,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    birthdate: {
        type:  Date,
        required: false
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type:  String,
        required: true
    }
});

const Item = module.exports = mongoose.model('Item', userschema);