'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');