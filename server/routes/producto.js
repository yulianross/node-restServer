const express = require('express');
const { verificaToken, verificaAdminRole } = require('../midlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    //populate: usuario y categoria
    // paginado
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.from) || 5;

    Producto.find({ disponible: true })
    .skip(from)
    .limit(to)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productosDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            productosDB
        });
    });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre descripcion')
    .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            productoDB
        });
    });
});

app.get('/productos/buscar/:termino', (req, res) => {
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productosDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            productosDB
        });
    })
});

app.post('/productos', verificaToken, (req, res) => {
    const body = req.body;
    const producto  = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productoDB
        });
    });


});

app.put('/producto/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const updatedProperties = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        dcategoria: body.categoria,
        disponible: body.disponible
    };

    Producto.findByIdAndUpdate(id, updatedProperties, { new: true }, (err, productoDB)=> {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err,
                message: 'producto no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'producto actualizado',
            productoDB
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    const id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoRemoved) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoRemoved) {
            res.status(400).json({
                ok: false,
                err,
                message: 'producto no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'producto borrado',
            productoRemoved
        });
    });
});

module.exports = app;