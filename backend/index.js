const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')

const User = require('./models/userModels')
const Data = require('./models/mapDataModel')
const Files = require('./models/convertedFilesDataModel.js')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const csvtojson = require('csvtojson')
const fs = require('fs')
const csv = require('csv-parser');
const xml2js = require('xml2js');
const { create, fragment, XMLString } = require('xmlbuilder2');
const convert = require('xml-js');

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/csvConverter')

let csvFilename = '';
let jsonFilename = '';
let xmlFilename = '';

// Conversion of CSV file to JSON file using existing mapping
const convertToJson = (csvFilePath, mappingData) => {
    const jsonFilename = csvFilename.slice(0, -4) + ".json";
    console.log('filename1')
    console.log(jsonFilename)
    const jsonFilePath = "jsonOutputs/" + jsonFilename;
    const jsonArray = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => {
            const jsonObject = {};

            // Map the CSV headers to JSON headers
            for (const jsonHeaderPath of Object.keys(mappingData)) {
                const csvHeader = mappingData[jsonHeaderPath];
                const jsonHeaderArr = jsonHeaderPath.split(".");

                let currentObject = jsonObject;
                for (let i = 0; i < jsonHeaderArr.length - 1; i++) {
                    const jsonKey = jsonHeaderArr[i];
                    if (!currentObject[jsonKey]) {
                        currentObject[jsonKey] = {};
                    }
                    currentObject = currentObject[jsonKey];
                }

                const lastJsonKey = jsonHeaderArr[jsonHeaderArr.length - 1];
                currentObject[lastJsonKey] = data[csvHeader];
            }

            jsonArray.push(jsonObject);
        })
        .on("end", () => {
            const jsonData = JSON.stringify(jsonArray, null, 2);

            fs.writeFile(jsonFilePath, jsonData, (err) => {
                if (err) {
                    console.error("Error writing JSON file:", err);
                } else {
                    console.log("JSON file successfully created:", jsonFilePath);
                }
            });
        });
    return jsonFilename
};

const convertToXml = (csvFilePath, mappingData) => {
    const csvFilename = csvFilePath.split('/').pop();
    const xmlFilename = csvFilename.slice(0, -4) + '.xml';
    const xmlFilePath = 'xmlOutputs/' + xmlFilename;

    const jsonArray = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            const jsonObject = {};

            // Map the CSV headers to JSON object
            for (const jsonHeaderPath of Object.keys(mappingData)) {
                const csvHeader = mappingData[jsonHeaderPath];
                const jsonHeaderArr = jsonHeaderPath.split('.');

                let currentObject = jsonObject;
                for (let i = 0; i < jsonHeaderArr.length - 1; i++) {
                    const jsonKey = jsonHeaderArr[i];
                    if (!currentObject[jsonKey]) {
                        currentObject[jsonKey] = {};
                    }
                    currentObject = currentObject[jsonKey];
                }

                const lastJsonKey = jsonHeaderArr[jsonHeaderArr.length - 1];
                currentObject[lastJsonKey] = data[csvHeader];
            }

            jsonArray.push(jsonObject);
        })
        .on('end', () => {
            const xmlData = convert.json2xml(
                { elements: [{ name: 'root', elements: jsonArray }] },
                { compact: true, ignoreComment: true, spaces: 2 }
            );

            fs.writeFile(xmlFilePath, xmlData, (err) => {
                if (err) {
                    console.error('Error writing XML file:', err);
                } else {
                    console.log('XML file successfully created:', xmlFilePath);
                }
            });
        });

    return xmlFilename;
}

// Uploading CSV file to create mapping
const uploadCsv = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "csv_uploads")
        },
        filename: function (req, file, cb) {
            // cb(null, file.originalname + "-" + Date.now() + ".csv")
            // csvFilename = Date.now() + '-' + file.originalname;
            csvFilename = 'csvFile.csv';
            cb(null, csvFilename)
        }
    })
});

// Uploading CSV file to use mapping and convert into JSON file
const uploadCsvToConvert = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "csv_convert_uploads")
        },
        filename: function (req, file, cb) {
            // cb(null, file.originalname + "-" + Date.now() + ".csv")
            csvFilename = Date.now() + '-' + file.originalname;
            // csvFilename = 'csvFile.csv';
            cb(null, csvFilename)
        }
    })
});

// uploading JSON file to create mapping
const uploadJson = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "json_xml_uploads")
        },
        filename: function (req, file, cb) {
            jsonFilename = '';
            xmlFilename = '';
            // filename = file.originalname + "-" + Date.now() + ".json";
            // jsonFilename = Date.now() + '-' + file.originalname;
            jsonFilename = 'jsonFile.json';
            cb(null, jsonFilename)
        }
    })
});

const uploadXml = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "json_xml_uploads")
        },
        filename: function (req, file, cb) {
            jsonFilename = '';
            xmlFilename = '';
            // filename = file.originalname + "-" + Date.now() + ".json";
            // jsonFilename = Date.now() + '-' + file.originalname;
            xmlFilename = 'xmlFile.xml';
            cb(null, xmlFilename)
        }
    })
});

// API to convert CSV file into JSON file
app.post('/api/uploadcsvtoconvert', uploadCsvToConvert.array('file'), async (req, res) => {

    console.log(req.body.mappingData)
    console.log(req.files[0].path)

    // convertToJson('csv_uploads/' + req.files[0].originalname)
    mappingData = JSON.parse(req.body.mappingData)
    console.log(mappingData)

    if (req.body.mappingType === 'json') {
        jsonFilename = '';
        xmlFilename = '';
        jsonFilename = convertToJson('csv_convert_uploads/' + csvFilename, mappingData)
    }
    else if (req.body.mappingType === 'xml') {
        jsonFilename = '';
        xmlFilename = '';
        xmlFilename = convertToXml('csv_convert_uploads/' + csvFilename, mappingData)
    }

    console.log('jsonFilename')
    console.log(jsonFilename)
    console.log('xmlFilename')
    console.log(xmlFilename)

    try {
        await Files.create({
            mappingname: req.body.mappingName,
            userid: req.body.userId,
            conversionname: req.body.conversionName,
            mappingid: req.body.mappingId,
            mappingtype: req.body.mappingType,
            csvfile: csvFilename,
            jsonfile: jsonFilename,
            xmlfile: xmlFilename,
        })
        console.log(jsonFilename)
        if (req.body.mappingType === 'json') {
            return res.json({ status: 'ok', jsonFilename: jsonFilename })
        } else if (req.body.mappingType === 'xml') {
            return res.json({ status: 'ok', xmlFilename: xmlFilename })
        }
    } catch (err) {

        // const jsonFilepath = 'D:/User/D_Documents/WebProjects/CSVConvertor/backend/jsonOutputs/' + jsonFilename;
        // const csvFilepath = 'csv_convert_uploads/' + csvFilename;

        // console.log('File csv deleted:', csvFilepath);
        // console.log('File json deleted:', jsonFilepath);

        // fs.unlink(csvFilepath, (err) => {
        //     if (err) {
        //         console.error('Error deleting file:', csvFilepath, err);
        //     } else {
        //         console.log('File deleted:', csvFilepath);
        //     }
        // });

        // fs.unlink(jsonFilepath, (err) => {
        //     if (err) {
        //         console.error('Error deleting file:', jsonFilepath, err);
        //     } else {
        //         console.log('File deleted:', jsonFilepath);
        //     }
        // });

        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }
})

// API to upload CSV file
app.post('/api/uploadcsv', uploadCsv.array('file'), async (req, res) => {

    // console.log(req.body)
    // console.log(req.files[0].path)
    const csvFilePath = req.files[0].path;
    console.log(csvFilePath)
    const csvData = await csvtojson().fromFile(csvFilePath);
    const csvHeaders = Object.keys(csvData[0]);

    // convertToJson('csv_uploads/' + req.files[0].originalname)
    // convertToJson('csv_uploads/' + csvFilename)

    return res.json({ status: 'ok', csvHeaders })
})

// API to upload JSON file
app.post('/api/uploadjson', uploadJson.array('file'), async (req, res) => {
    // console.log(req.body)
    // console.log(req.files)

    const jsonData = JSON.parse(fs.readFileSync(req.files[0].path, 'utf-8'));
    const jsonHeaders = Object.keys(jsonData);

    return res.json({ status: 'ok', jsonHeaders })
})

// API to upload nested JSON file
app.post('/api/uploadnestedjson', uploadJson.array('file'), async (req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync(req.files[0].path, 'utf-8'));
        const jsonHeaders = getJsonHeaders(jsonData);
        console.log('jsonData')
        console.log(jsonData)
        console.log('jsonHeaders')
        console.log(jsonHeaders)

        return res.json({ status: 'ok', jsonHeaders });
    } catch (error) {
        console.error('Error parsing JSON file:', error);
        return res.json({ status: 'error' });
    }
});

// API to upload nested XML file
app.post('/api/uploadnestedxml', uploadXml.array('file'), async (req, res) => {
    try {
        const xmlData = fs.readFileSync(req.files[0].path, 'utf-8');
        const jsonData = await parseXmlToJson(xmlData);

        console.log('jsonData')
        console.log(jsonData)

        const jsonHeaders = getJsonHeaders(jsonData);
        console.log('jsonHeaders')
        console.log(jsonHeaders)
        return res.json({ status: 'ok', jsonHeaders });
    } catch (error) {
        console.error('Error parsing XML file:', error);
        return res.json({ status: 'error' });
    }
});

// Function to parse XML to JSON using xml2js library
function parseXmlToJson(xmlData) {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({ explicitArray: false });
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Recursive function to retrieve nested JSON headers
function getJsonHeaders(data, prefix = '') {
    let headers = [];

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const nestedKey = prefix ? `${prefix}.${key}` : key;

            if (typeof data[key] === 'object') {
                if (Array.isArray(data[key])) {
                    const nestedHeaders = getJsonHeaders(data[key][0], nestedKey);
                    headers = headers.concat(nestedHeaders);
                    console.log(headers)
                } else {
                    const nestedHeaders = getJsonHeaders(data[key], nestedKey);
                    headers = headers.concat(nestedHeaders);
                    console.log(headers)
                }
            } else {
                headers.push(nestedKey);
                console.log(headers)
            }
        }
    }

    return headers;
}

// API to download CSV/JSON file
app.post('/api/downloadfile', async (req, res) => {
    // res.download("jsonOutputs/output.json");
    const filepath = req.body.filename
    console.log(req.body)
    const type = req.body.type

    try {
        if (type === 'json') {
            const jsonPath = "jsonOutputs/" + filepath
            console.log(jsonPath);
            res.download(jsonPath);
        }
        else if (type === 'csv') {
            const csvPath = "csv_convert_uploads/" + filepath
            console.log(csvPath);
            res.download(csvPath);
        }
        else if (type === 'xml') {
            const csvPath = "xmlOutputs/" + filepath
            console.log(csvPath);
            res.download(csvPath);
        }
        else {
            throw new Error('Invalid file type');
        }
        // return res.json({ status: 'ok' })

    } catch (err) {
        res.status(404).json({ status: 'error', error: 'File not found' });
    }
    // console.log(filepath);
    // res.download("jsonOutputs/"+filepath);
})

// API to create JSON mapping
app.post('/api/createjsonmapping', async (req, res) => {
    console.log(req.body)

    try {
        await Data.create({
            userid: req.body.userId,
            mappingname: req.body.mapName,
            mappingtype: req.body.mappingType,
            csvheaders: req.body.csvHeader,
            jsonxmlheaders: req.body.jsonHeader,
            mappingdata: req.body.mappingData,
        })
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }

})

app.post('/api/createxmlmapping', async (req, res) => {
    console.log(req.body)

    try {
        await Data.create({
            userid: req.body.userId,
            mappingname: req.body.mapName,
            mappingtype: req.body.mappingType,
            csvheaders: req.body.csvHeader,
            jsonxmlheaders: req.body.xmlHeader,
            mappingdata: req.body.mappingData,
        })
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }

})

// API to update mapdata
app.post('/api/updatemapping', async (req, res) => {
    console.log(req.body)

    const id = req.body.id
    const mappingData = req.body.mappingData

    try {
        const updatedResult = await Data.findByIdAndUpdate(id, { mappingdata: mappingData }, { new: true },)
        console.log(updatedResult)
        return res.json({ status: 'ok' })
    } catch (err) {
        console.log(err)
        return res.json({ status: 'error', error: 'Could Not Update Mapping' })
    }


})

// API to get mapdata
app.get('/api/getmapdata/:userid', async (req, res) => {
    console.log(req.params.userid)
    const userId = req.params.userid
    Data.find({ userid: userId })
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
})

// API to get conversion data
app.get('/api/getconversiondata/:userid', async (req, res) => {
    console.log(req.params.userid)
    const userId = req.params.userid
    Files.find({ userid: userId })
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
})

// API to register
app.post('/api/register', async (req, res) => {

    console.log(req.body);

    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            username: req.body.userName,
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: newPassword,
        })
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', error: 'Duplicate email' })
    }
})

// API to login
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        // password: req.body.password,
    })

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid Login' })
    }

    const isPassword = await bcrypt.compare(req.body.password, user.password);

    if (isPassword) {

        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secret123'
        )

        return res.json({ status: 'ok', user: token, id: user._id })
    } else {
        return res.json({ status: 'error', user: false })

    }
})

// const UserModel = mongoose.model('User', UserSchema);

// Find a user by their email
User.findOne({ email: 'vp@gmail.com' })
    .then(user => {
        if (user) {
            console.log('User ID:', user._id.toString());
        } else {
            console.log('User not found');
        }
    })
    .catch(error => {
        console.error('Error finding user:', error);
    });

app.listen(1337, () => {
    console.log('Server started on 1337')
})
