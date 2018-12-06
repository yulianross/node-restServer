const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { verificaToken, verificaTokenImg } = require('../midlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(pathNoImage);
    }

    

});

module.exports = app;