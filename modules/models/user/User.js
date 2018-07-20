let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', userSchema, 'user');

