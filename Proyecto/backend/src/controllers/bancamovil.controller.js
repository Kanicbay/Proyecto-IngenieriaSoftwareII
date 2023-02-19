'use strict'
var cuentaSchema = require('../models/cuenta');
var usuarioSchema = require('../models/usuario');
var verificacionSchema = require('../models/verificaciones');
var bcrypt = require('bcrypt');
var {v4: uuidv4} = require('uuid');

var controller = {
    createAccount: async function(req, res){
        var numeroCuenta = parseInt(uuidv4(), 16);
        var nombres = req.body.nombres;
        var apellidos = req.body.apellidos;
        var cedula = req.body.cedula;
        var correo = req.body.correo;
        var tipoCuenta = req.body.tipoCuenta;
        var saldo = req.body.saldo;
        var cuentaExiste = false;

        var cuenta = new cuentaSchema({numeroCuenta, nombres, apellidos, cedula, correo, tipoCuenta, saldo});
        var verificacion = new verificacionSchema({cedula});

        const data = await cuentaSchema.findOne({ cedula: cedula });
        if(data){
            cuentaExiste = true;
        }

        if(cuentaExiste){
            return res.status(400).send({message: 'La cuenta ya existe!'});
        }else{
            cuenta.save((err, accountStored) => {
                if(err) return res.status(500).send({message: 'Error!'});
                if(!accountStored) return res.status(404).send({message: 'Error!'});
            });
            verificacion.save((err, verificacionStored) => {
                if(err) return res.status(500).send({message: 'Error!'});
                if(!verificacionStored) return res.status(404).send({message: 'Error!'});
                return res.status(200).send({message: "Proceso exitoso"});
            });

        }
    },
    
    createUsuario: async function(req, res){
        var cedula = req.body.cedula;
        var usuario = req.body.usuario;
        let contrasena = req.body.contrasena;

        const user = await usuarioSchema.findOne({ cedula: cedula });
        if(user){
            return res.status(400).send({message: 'El usuario ya existe!'});
        }

        async function hashPassword(contrasena) {
            try {
              const salt = await bcrypt.genSalt(10);
              const hash = await bcrypt.hash(contrasena, salt);
              return hash;
            } catch (error) {
              console.log(error);
            }
          }
          
        contrasena = await hashPassword(contrasena);

        const cuenta = await cuentaSchema.findOne({ cedula: cedula });
        if (!cuenta) {
            return res.status(404).json({ message: "No tiene una cuenta asociada" });
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
                return res.status(404).send({message: 'Error!!'});
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
            dataOrigen.saldo = parseFloat(dataOrigen.saldo) - parseFloat(monto);
            dataDestino.saldo = parseFloat(dataDestino.saldo) + parseFloat(monto);
            console.log(dataOrigen.saldo);
            console.log(dataDestino.saldo);

            await dataOrigen.save();
            await dataDestino.save();
        }        
        return res.status(200).send({message: 'Proceso exitoso'});
    },

}

module.exports = controller;