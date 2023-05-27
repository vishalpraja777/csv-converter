const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        username: { type: String, require: true },
        firstname: { type: String },
        lastname: { type: String },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
    },
    { collection: 'signUpData'} 
)

const model = mongoose.model('signUpData', User)

module.exports = model