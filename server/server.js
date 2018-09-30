require('./config/config');


const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path')


const bodyParser = require('body-parser');


mongoose.connect(process.env.URLDB, (err) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'))

// app.use(express.static(__dirname + '/../public'));
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});