'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cuentaVinculadaSchema = Schema({
    numeroCuenta: {
        type: String,
        required: true,
        unique: true
    },
    saldo: {
        type: Number,
        default: 0,
    },
    cantidadMaximaTransferencia: {
        type: Number,
        default: 1200,
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

module.exports = mongoose.model('CuentaVinculada', cuentaVinculadaSchema, 'cuentasVinculadas');