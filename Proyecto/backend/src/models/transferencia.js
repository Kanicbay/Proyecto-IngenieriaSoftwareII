'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transferenciaSchema = Schema({
    cuentaPertenece: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: function (value) {
                return value.model('CuentaCorriente') ||
                       value.model('CuentaAhorros') ||
                       value.model('CuentaVinculada');
            },
            message: 'La cuenta de origen no existe'
        }
    },
    fechaTransaccion: {
        type: Date,
        default: Date.now
    },
    monto: {
        type: Number,
        required: true,
    },
    montoFinal: {
        type: Number,
        required: true,
    },
    receptor: {
        type: String,
        required: true,
    },
    cuentaReceptor: {
        type: String,
        required: true,
    },
    bancoReceptor: {
        type: String,
        required: true,
    },
    iva: {
        type: Number,
        default: 0.0,
    },

});

module.exports = mongoose.model('Transferencias', transferenciaSchema, 'transferencias');