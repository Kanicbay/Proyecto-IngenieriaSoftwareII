'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cuentaCorrienteSchema = Schema({
    numeroCuenta: {
        type: String,
        required: true,
        unique: true
    },
    saldo: {
        type: Number,
        default: 0,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    estadoCuenta: {
        type: String,
        enum: ['Activa', 'Pasiva'],
        default: 'Activa'
    },
});

module.exports = mongoose.model('CuentaCorriente', cuentaCorrienteSchema, 'cuentasCorrientes');