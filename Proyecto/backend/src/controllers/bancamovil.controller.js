'use strict'
var cuentaSchema = require('../models/cuenta');
var usuarioSchema = require('../models/usuario');
var bcrypt = require('bcrypt');
var {v4: uuidv4} = require('uuid');

var controller = {
    createAccount: function(req, res){
        var numeroCuenta = parseInt(uuidv4(), 16);
        var nombres = req.body.nombres;
        var apellidos = req.body.apellidos;
        var cedula = req.body.cedula;
        var correo = req.body.correo;
        var tipoCuenta = req.body.tipoCuenta;
        var saldo = req.body.saldo;

        var cuenta = new cuentaSchema({numeroCuenta, nombres, apellidos, cedula, correo, tipoCuenta, saldo});

        cuenta.save((err, accountStored) => {
            if(err) return res.status(500).send({message: 'Error!'});
            if(!accountStored) return res.status(404).send({message: 'Error!'});
            return res.status(200).send({"message": "Proceso exitoso"});
        });
    },
    
    createUsuario: async function(req, res){
        var cedula = req.body.cedula;
        var usuario = req.body.usuario;
        var contrasena = req.body.contrasena;

        console.log({cedula, usuario, contrasena});

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(contrasena, salt, (err, hash) => {
                if (err) throw err;
                contrasena = hash;
            });
        });

        const cuenta = await cuentaSchema.findOne({ cedula: cedula });
        if (!cuenta) {
            return res.status(404).json({ message: "Error!" });
        }
        var cuentaId = cuenta._id;

        var data = new usuarioSchema({
            usuario: usuario,
            contrasena: contrasena,
            cuenta: cuentaId,
        });

        data.save((err, usuarioStored) => {
            if(err) return res.status(500).send({message: 'Error!'});
            if(!usuarioStored) return res.status(404).send({message: 'Error!'});
            return res.status(200).send({"message": "Proceso Exitoso"});
        });
    },

    loginUser: async function(req, res){
        var usuario = req.body.usuario;
        var contrasena = req.body.contrasena;

        const data = await usuarioSchema.findOne({ usuario: usuario }, 'usuario contrasena').populate('cuenta', 'numeroCuenta nombres apellidos cedula correo');
        if (!data) {
            return res.status(404).json({ message: "Error!" });
        }
        bcrypt.compare(contrasena, data.contrasena, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                return res.status(200).send({usuario: data.usuario, numeroCuenta: data.cuenta.numeroCuenta, nombres: data.cuenta.nombres, apellidos: data.cuenta.apellidos, cedula: data.cuenta.cedula, correo: data.cuenta.correo});
            }else{
                return res.status(404).send({message: 'Error!'});
            }
        });
    },

    findAccount : async function(req, res){
        var numeroCuenta = req.body.cuenta;
        const data = await cuentaSchema.findOne({ numeroCuenta: numeroCuenta });
        if (!data) {
            return res.status(404).json({ message: "Error!" });
        }
        return res.status(200).send({message: 'Proceso exitoso'});
    },

    transferirDinero : async function(req, res){
        var numeroCuentaOrigen = req.body.numeroCuentaOrigen;
        var numeroCuentaDestino = req.body.numeroCuentaDestino;
        var monto = req.body.monto;

        console.log({numeroCuentaOrigen, numeroCuentaDestino, monto});

        const dataOrigen = await cuentaSchema.findOne({ numeroCuenta: numeroCuentaOrigen });
        if (!dataOrigen) {
            return res.status(404).json({ message: "Error!" });
        }
        const dataDestino = await cuentaSchema.findOne({ numeroCuenta: numeroCuentaDestino });
        if (!dataDestino) {
            return res.status(404).json({ message: "Error!" });
        }
        if(dataOrigen.saldo == 0 || dataOrigen.saldo < monto){
            return res.status(404).json({ message: "Error Saldo insuficiente" });
        }
        else{
            dataOrigen.saldo = dataOrigen.saldo - monto;
            dataDestino.saldo = dataDestino.saldo + monto;
        }        
        return res.status(200).send({message: 'Proceso exitoso'});
    },

}

module.exports = controller;