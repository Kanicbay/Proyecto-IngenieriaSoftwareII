'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cuentaSchema = Schema({
    numeroCuenta: {
        type: String,
        required: true,
        unique: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: { 
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true,
        length: 10,
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    tipoCuenta: {
        type: String,
        required: true,
        enum: ['Ahorros', 'Corriente', 'Vinculada']
    },
    saldo: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Cuenta', cuentaSchema, 'cuentas');