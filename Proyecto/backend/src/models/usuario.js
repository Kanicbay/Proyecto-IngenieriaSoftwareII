const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuenta'
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');