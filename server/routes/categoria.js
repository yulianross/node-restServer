const express = require('express');
const { verificaToken, verificaAdminRole }= require('../midlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');


// mostrar todas las categorias
app.get('/categorias', verificaToken, (req, res) => {
   
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Categoria.count({}, (err, count) => {
            res.json({
                ok: true,
                categorias,
                count
            });
        });   
    });
});

//mostrar una categoria
app.get('/categoria/:id', verificaToken, (req, res) => {
    const _id = req.params.id;

    Categoria.findOne({ _id }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'categoria no encontrada',
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//crear una categoria
app.post('/categoria', verificaToken, (req, res) => {
    const categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const descripcionCat = {
        descripcion : req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcionCat, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
      });

});

//actualizar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: 'el id de la categoria no existe'
            });
        }

        res.json({
            ok: true,
            categoriaBorrada,
            message: 'categoria borrada'
        });
    });
});

module.exports = app;





