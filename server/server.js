require('./config/config');


const mongoose = require('mongoose');
const express = require('express');
const app = express();



const bodyParser = require('body-parser');


mongoose.connect(process.env.URLDB, (err) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});