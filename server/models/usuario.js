const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un role válido'
};
const Schema = mongoose.Schema;


const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']

    },
    email: {
        type: String,
        required: [true, 'elemail es necesario'],
        unique: true

    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesaria'],


    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'el role es necesario'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
   
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, '{PATH} debe de ser único');

module.exports = mongoose.model('usuario', userSchema);
