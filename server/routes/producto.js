const express = require('express');
const Producto = require('./../models/producto');
const app = express();
const _ = require('underscore');
const { Autentificar, verificaAdmin } = require('./../middlewares/autentifiacion')

app.get('/producto/:id', Autentificar, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Ningún producto con ese id'
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Ningún producto con ese id'
                })
            }
            res.status(200).json({
                ok: true,
                producto: productoDB
            });
        })
});

app.get('/producto', Autentificar, (req, res) => {
    Producto.find({})
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})



app.post('/producto', [Autentificar, verificaAdmin], (req, res) => {
    let body = req.body;
    console.log(body);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(200).json({
            ok: true,
            productoDB
        })
    })
})

app.put('/producto/:id', Autentificar, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    body = _.pick(body, ['nombre', 'precioUni', 'descripcion', 'disponible']);
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(200).json({
                ok: false,
                message: 'No se encontró producto a actualizar'
            })
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
})

app.delete('/producto/:id', Autentificar, (req, res) => {
    let id = req.params.id;
    let disp = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, disp, (err, productoAct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoAct) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no actualizado'
                }
            })
        }
        res.status(200).json({
            ok: true,
            producto: productoAct
        })
    })
})

module.exports = app;