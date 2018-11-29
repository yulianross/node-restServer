const bcrypt = require('bcrypt');
const _ = require('underscore');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

app.post('/google',async (req, res) => {
    let token = req.body.idtoken;
    
    let user = await verify(token).catch((err) => {
        res.status(403).json({
            ok: false,
            err
        });
    })
    
    Usuario.findOne({ email: user.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            }); 
        }
        
        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe de usar su autenticacion normal'
                    }
                }); 
            } else {
                let token = jwt.sign({
                    usuario: userDB,
        
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                
                return res.json({
                    ok: true,
                    userDB,
                    token
                });
            }

        } else {
            // si el usuario no existe en nuestra base de datos
            let usuario = new Usuario({
                nombre : user.nombre,
                email: user.email,
                img: user.img,
                google: true,
                password: ':)'
            });

            usuario.save((err, userSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    usuario: userSaved,
                    token
                });

            })
        }
    }); 
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

module.exports = app;

