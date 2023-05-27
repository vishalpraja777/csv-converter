const mongoose = require('mongoose');


const Data = new mongoose.Schema(
    {
        // email: { type: String, require: true},
        userid: { type: String, require: true},
        mappingname: { type: String, require: true},
        mappingtype: { type: String },
        csvheaders: { type: Array },
        jsonheaders: { type: Array},
        mappingdata: { type: Object},
    },
    { collection: 'mappingData'} 
);

Data.index({ userid: 1, mappingname: 1 }, { unique: true });

const model = mongoose.model('mappingData', Data)

module.exports = model