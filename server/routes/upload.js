const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'es necesario adjuntar un archivo'
        });
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            message: 'no se ha subido ningun archivo'
        });
    }
    // validación de tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: `los tipos permitidos son: ${tiposValidos.join(', ')}`
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.sampleFile;

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[1];
    

    if (extensionesValidas.indexOf(extension) >= 0) {
        let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`
        
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (tipo === 'usuarios') {
                imagenUsuario(id, res, nombreArchivo);
            } else {
                imagenProducto(id, res, nombreArchivo);
            }
            
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: `las extensiones permitidas son: ${extensionesValidas.join(', ')}`
        });
    }
});

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
};


const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err
            });
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
};

const borrarArchivo = (img, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    console.log(fs.existsSync(pathImagen));
    if (fs.existsSync(pathImagen)) {
       fs.unlinkSync(pathImagen);  
    }
};

module.exports = app;
