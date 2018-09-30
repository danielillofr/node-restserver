const express = require('express');
const Usuario = require('./../models/usuario');
const bcrypt = require('bcryptjs')
const app = express();

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



app.post('/google', async(req, res) => {

    if (!req.body.idtoken) {
        return res.status(400).json({
            ok: false,
            message: 'No ha llegado ningún token de google'
        })
    }
    let token = req.body.idtoken;

    googleUser = await verify(token).catch((err) => {
        return res.json({
            ok: false,
            message: 'Token no valido'
        })

    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioDB) {
            console.log('USUARIO ENCONTRADO');
            if (usuarioDB.google) {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: 3600 * 24 * 30 });
                console.log("Es de google, genero un token");
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            } else {
                console.log('No es de google, error');
                return res.status(200).json({
                    ok: false,
                    message: 'El usuario se logueo con su correo no con google'
                })
            }
        } else {
            console.log('USUARIO NO ENCONTRADO, HAY QUE CREARLO');
            usuario = new Usuario({
                nombre: googleUser.name,
                email: googleUser.email,
                img: googleUser.picture,
                google: true,
                password: ':)'
            });
            console.log(usuario);
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB
                })
            })
        }

    })
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;
}


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
        if (!(bcrypt.compareSync(body.password, usuarioDB.password))) {
            return res.json({
                ok: false,
                message: "Contraseña incorrecta"
            })
        }



        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 3600 * 24 * 30 }); //Un mes

        res.json({
            ok: true,
            message: "DD",
            usuario: usuarioDB,
            token
        })

    })

});

module.exports = app;