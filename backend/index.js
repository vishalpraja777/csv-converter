const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/userModels')
const Data = require('./models/mapDataModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const csvtojson = require('csvtojson')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:127.0.0.1:27017/csvConverter')

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

const convertToJson = (filepath) => {
    csvtojson()
        .fromFile(filepath)
        .then((json) => {
            // console.log(json)

            fs.writeFileSync('jsonOutputs/output.json', JSON.stringify(json), "utf-8", (err) => {
                if (err) console.log(err)
            });
        })
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

app.post('/api/uploadcsvtoconvert', uploadCsv.array('file'), async (req, res) => {

    // console.log(req.body)
    console.log(req.files[0].path)

    // convertToJson('csv_uploads/' + req.files[0].originalname)
    convertToJson('csv_uploads/' + csvFilename)

    return res.json({ status: 'ok' })
})



app.get('/api/downloadjson', async (req, res) => {
    // res.download("jsonOutputs/output.json");
    res.download("jsonOutputs/output.json");
})

app.post('/api/createmapping', async (req, res) => {
    console.log(req.body)

    try {
        await Data.create({
            mappingname: req.body.mapName.toLowerCase(),
            // email: req.body.email,
            userid: req.body.id,
            csvheaders: req.body.csvHeader,
            jsonheaders: req.body.jsonHeader,
            mapping: req.body.mapping,
        })
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', error: 'Duplicate Mapping' })
    }

})

app.get('/api/getmapdata/:userid', async (req, res) => {
    console.log(req.params.userid)
    const data = req.params.userid
    Data.find({$where: function(data) { 
        return ((this.userid)  != data)
    } } )
    .then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err)
    });
})

app.post('/api/register', async (req, res) => {

    console.log(req.body);

    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
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