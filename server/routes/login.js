const bcrypt = require('bcrypt');
const _ = require('underscore');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña incorrectos'
                }
            }); 
        }
        if(!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            }); 
        }

        let token = jwt.sign({
            usuario: userDB,

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })


        res.json({
            ok: true,
            userDB,
            token
        });
    })
    
});

module.exports = app;
