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

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/csvConverter')

let csvFilename = '';
let jsonFilename = '';

// Set up Multer storage engine
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (file.fieldname === 'csv') {
//             cb(null, 'csv_uploads');
//         } else {
//             cb(null, 'json_uploads');
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// Create Multer instance
// const upload = multer({ storage: storage });

// app.post('/api/bothupload', upload.fields([{ name: 'csv', maxCount: 1 }, { name: 'json', maxCount: 1 }]), async (req, res) => {
//     try {
//         // Read CSV and JSON files
//         const csvFilePath = req.files['csv'][0].path;
//         const jsonData = JSON.parse(fs.readFileSync(req.files['json'][0].path, 'utf-8'));

//         // Convert CSV to JSON
//         const csvData = await csvtojson().fromFile(csvFilePath);

//         // Get headers of CSV and JSON files
//         const csvHeaders = Object.keys(csvData[0]);
//         const jsonHeaders = Object.keys(jsonData);

//         // Send headers back to client
//         res.status(200).json({ csvHeaders, jsonHeaders });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

const convertToJson = (csvFilePath, mappingData) => {
    // csvtojson()
    //     .fromFile(filepath)
    //     .then((json) => {
    //         // console.log(json)

    //         fs.writeFileSync('jsonOutputs/output.json', JSON.stringify(json), "utf-8", (err) => {
    //             if (err) console.log(err)
    //         });
    //     })

    jsonFilename = csvFilename.slice(0, -4) + '.json'
    const jsonFilePath = 'jsonOutputs/' + jsonFilename
    const jsonArray = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            const jsonObject = {};
            // console.log(data)


            // Map the CSV headers to JSON headers
            for (const csvHeader of Object.keys(mappingData)) {
                const jsonHeader = mappingData[csvHeader];
                jsonObject[jsonHeader] = data[csvHeader];
                // console.log("\nData:" + jsonHeader)
            }
            // console.log('jsonObject')
            // console.log(jsonObject)
            jsonArray.push(jsonObject);
            // console.log('jsonArray')
            // console.log(jsonArray)
        })
        .on('end', () => {
            const jsonData = JSON.stringify(jsonArray, null, 2);
            // console.log(jsonData)

            fs.writeFile(jsonFilePath, jsonData, (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log('JSON file successfully created:', jsonFilePath);
                }
            });
        });
}


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


const uploadJson = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "json_uploads")
        },
        filename: function (req, file, cb) {
            // filename = file.originalname + "-" + Date.now() + ".json";
            // jsonFilename = Date.now() + '-' + file.originalname;
            jsonFilename = 'jsonFile.json';
            cb(null, jsonFilename)
        }
    })
});

app.post('/api/uploadcsvtoconvert', uploadCsvToConvert.array('file'), async (req, res) => {

    console.log(req.body.mappingData)
    console.log(req.files[0].path)

    // convertToJson('csv_uploads/' + req.files[0].originalname)
    mappingDataJson = JSON.parse(req.body.mappingData)
    console.log(mappingDataJson)
    convertToJson('csv_convert_uploads/' + csvFilename, mappingDataJson)

    try {
        await Files.create({
            mappingname: req.body.mappingName,
            userid: req.body.userId,
            conversionname: req.body.conversionName,
            mappingid: req.body.mappingId,
            csvfile: csvFilename,
            jsonfile: jsonFilename,
        })
        console.log(jsonFilename)
        return res.json({ status: 'ok', jsonFilename: jsonFilename })
    } catch (err) {

        const jsonFilepath = 'D:/User/D_Documents/WebProjects/CSVConvertor/backend/jsonOutputs/' + jsonFilename;
        const csvFilepath = 'csv_convert_uploads/' + csvFilename;

        console.log('File csv deleted:', csvFilepath);
        console.log('File json deleted:', jsonFilepath);

        fs.unlink(csvFilepath, (err) => {
            if (err) {
                console.error('Error deleting file:', csvFilepath, err);
            } else {
                console.log('File deleted:', csvFilepath);
            }
        });

        fs.unlink(jsonFilepath, (err) => {
            if (err) {
                console.error('Error deleting file:', jsonFilepath, err);
            } else {
                console.log('File deleted:', jsonFilepath);
            }
        });

        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }
})

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

app.post('/api/uploadjson', uploadJson.array('file'), async (req, res) => {
    // console.log(req.body)
    // console.log(req.files)

    const jsonData = JSON.parse(fs.readFileSync(req.files[0].path, 'utf-8'));
    const jsonHeaders = Object.keys(jsonData);

    return res.json({ status: 'ok', jsonHeaders })
})

// app.post('/api/uploadMapping', async (req, res) => {
//     console.log(req.body)
// })

app.post('/api/downloadjson', async (req, res) => {
    // res.download("jsonOutputs/output.json");
    const filepath = req.body.filename
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
        else {
            throw new Error('Invalid file type');
          }
        // return res.json({ status: 'ok' })

    } catch(err) {
        res.status(404).json({ status: 'error', error: 'File not found' });
    }
    // console.log(filepath);
    // res.download("jsonOutputs/"+filepath);
})

app.post('/api/createmapping', async (req, res) => {
    console.log(req.body)

    try {
        await Data.create({
            userid: req.body.userId,
            mappingname: req.body.mapName,
            mappingtype: req.body.mappingType,
            csvheaders: req.body.csvHeader,
            jsonheaders: req.body.jsonHeader,
            mappingdata: req.body.mappingData,
        })
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }

})

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