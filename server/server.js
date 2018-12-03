require('./config/config');
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

// habilitar el public
app.use(express.static(path.resolve(__dirname, '../public')));
 
 
mongoose.connect(process.env.URLDB, { useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('base de dato ONLINE');
});
 
app.listen(process.env.PORT, () => console.log('escuchando...'));