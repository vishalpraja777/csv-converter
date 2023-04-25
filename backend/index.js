const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/userModels')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/csvConverter')

app.post('/api/register', async (req, res) => {
    
    console.log(req.body);

    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({ status: 'ok' })
    } catch (err){
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        // password: req.body.password,
    })

    if(!user){
        return res.json({ status: 'error', error: 'Invalid Login' })
    }

    const isPassword = await bcrypt.compare(req.body.password, user.password);

    if(isPassword) {

        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secret123'
        )

        return res.json({ status: 'ok', user: token})
    } else {
        return res.json({ status: 'error', user: false})

    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})