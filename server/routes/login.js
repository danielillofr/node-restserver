const express = require('express');
const Usuario = require('./../models/usuario');
const bcrypt = require('bcryptjs')
const app = express();

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.json({
                ok: false
            })
        }
        if (!usuarioDB) {
            return res.json({
                ok: false,
                message: "Usuario no encontrado"
            })
        }
        // console.log(usuarioDB);
        if (!(bcrypt.compareSync(body.password, usuarioDB.password))) {
            return res.json({
                ok: false,
                message: "Contraseña incorrecta"
            })
        }



        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 3600 * 24 * 30 }); //Un mes

        console.log(usuarioDB);
        res.json({
            ok: true,
            message: "DD",
            usuario: usuarioDB,
            token
        })

    })

});

module.exports = app;