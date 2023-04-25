const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        mappingJSON: { type: String},
        mappingCSV: { type: String}
    },
    { collection: 'userdata'} 
)

const model = mongoose.model('Userdata', User)

module.exports = model