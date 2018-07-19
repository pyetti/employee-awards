let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    admin: Boolean
});

module.exports = mongoose.model('user', userSchema, 'user');

