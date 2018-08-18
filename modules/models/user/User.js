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
    company: {
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
    created_on: {
        type: Date,
        required: true
    },
    signature_image: {
        type: String,
        required: true
    }
});

module.exports = {
    users_prod: mongoose.model('user', userSchema, 'user'),
    users_dev: mongoose.model('users_dev', userSchema, 'users_dev')
};

