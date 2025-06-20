'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');

var verificacionSchema = Schema({
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    codigo_verificacion: {
        type: String,
        unique: true,
        default : crypto.randomBytes(5).toString('hex').toUpperCase().substring(0, 6)
    },
    tiempoExpiracion: {
        type: Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('Verificacion', verificacionSchema, 'verificaciones');