const mongoose = require('mongoose');


const Data = new mongoose.Schema(
    {
        // email: { type: String, require: true},
        userid: { type: String, require: true},
        mappingname: { type: String,require: true, unique: true},
        csvheaders: { type: Array },
        jsonheaders: { type: Array},
        mapping: { type: Object},
    },
    { collection: 'mappingData'} 
)

const model = mongoose.model('mappingData', Data)

module.exports = model