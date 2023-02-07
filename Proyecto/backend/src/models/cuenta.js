const mongoose = require('mongoose');

const cuentaSchema = mongoose.Schema({
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
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
});



module.exports = mongoose.model('Cuenta', cuentaSchema, 'cuentas');