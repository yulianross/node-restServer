const express = require('express')
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../midlewares/autenticacion');

app.get('/usuario', verificaToken, function (req, res) {
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit || 0);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(from)
    .limit(limit)
    .exec((err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.count({ estado: true }, (err, count) => {
            res.json({
                ok: true,
                users,
                count
            });
        });     
    })
  });
  
  app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
      let body = req.body;
      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
          role: body.role
      });

      usuario.save((err, userDB) => {
          if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              });
          }
          res.json({
              ok: true,
              usuario: userDB
          });
      });
  });
      
  app.put('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

      Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
      });
  });
  
  app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
      let id = req.params.id;

      //Usuario.findByIdAndRemove(id, (err, userDB) => {
    Usuario.findByIdAndRemove(id, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: 'usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            userDB
        });
      });
  });
  
  module.exports = app;