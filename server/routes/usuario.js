const express = require('express');
const Usuario = require('./../models/usuario');
const app = express();
const _ = require('underscore');

const bcrypt = require('bcryptjs');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({}, 'nombre email', { limit: limite, skip: desde }, (err, usuarios) => {
        if (err) {
            return res.json({
                ok: false
            });
        }
        Usuario.count({}, (err, cuantos) => {
            res.json({
                ok: true,
                usuarios,
                cuantos
            })
        })
    })

});

app.post('/usuario', function(req, res) {


    let body = req.body;

    console.log(body);

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    console.log(`Antes:${usuario}`);

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuarioDB
        })
    })

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let body = req.body;

    body = _.pick(body, ['nombre', 'email', 'password', 'img', 'role']);




    console.log(body, id);
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDb
        })
    })

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuario) => {
        console.log(err);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuario) {
            res.json({
                ok: true,
                usuario
            })
        } else {
            res.json({
                ok: false,
                message: 'Usuario no encontrado'
            })
        }
    })

});


module.exports = app