const path = require('path');
const express = require('express');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const app = express();
mongoose.connect
(
    'mongodb+srv://bger:5s6Xkm3ji8HenQAP@cluster0.zfesq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {

    console.log('Connected to MongoDB');
}).catch(() => {

    console.log('Connection failed!');
})

// app.use(bodyParser.json());
app.use(express.json());
app.use(urlencoded({extended: true}));

app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
})

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;