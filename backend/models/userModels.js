const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
    },
    { collection: 'signUpData'} 
)

const model = mongoose.model('signUpData', User)

module.exports = model