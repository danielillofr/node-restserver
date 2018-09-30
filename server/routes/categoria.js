const express = require('express');
const Categoria = require('./../models/categoria');
const app = express();
const _ = require('underscore');

const { Autentificar, verificaAdmin } = require('./../middlewares/autentifiacion')

app.get('/categoria', Autentificar, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    // Categoria.find({}, 'nombre usuario', { limit: limite, skip: desde }, (err, categorias) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', ['nombre', 'email'])
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count({}, (err, cuantos) => {
                res.status(200).json({
                    ok: true,
                    categorias,
                    cuantos
                })
            })
        })
})

app.get('/categoria/:id', Autentificar, function(req, res) {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(200).json({
                ok: false,
                message: 'No hay categoria con ese id'
            })
        } else {
            res.status(200).json({
                ok: true,
                categoria
            })
        }
    })
})

app.post('/categoria', [Autentificar, verificaAdmin], function(req, res) {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

app.put('/categoria/:id', [Autentificar, verificaAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    body = _.pick(body, ['nombre']);
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(200).json({
            ok: true,
            categoria
        })
    })
})

app.delete('/categoria/:id', [Autentificar, verificaAdmin], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(200).json({
            ok: true,
            categoria
        })
    })
})

module.exports = app;