const mongoose = require('mongoose');


const Files = new mongoose.Schema(
    {
        conversionname: { type: String,require: true},
        userid: { type: String, require: true},
        mappingid: { type: String },
        mappingname: { type: String},
        mappingtype: { type: String},
        csvfile: { type: String },
        jsonfile: { type: String},
        xmlfile: { type: String},
    },
    { collection: 'convertedFiles'} 
);

Files.index({ userid: 1, conversionname: 1 }, { unique: true });

const model = mongoose.model('convertedFiles', Files)

module.exports = model