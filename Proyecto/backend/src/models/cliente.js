'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clienteSchema = Schema({
    cedula: {
        type: String,
        required: true,
        unique: true,
        length: 10,
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    cuentaCorriente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CuentasCorrientes',
        default: null
    },
    cuentaAhorros: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CuentasAhorros',
        default: null
    },
    cuentaVinculada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CuentasVinculadas',
        default: null
    },
});

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');