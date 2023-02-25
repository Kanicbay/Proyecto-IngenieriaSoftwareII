'use strict'
var usuarioSchema = require('../models/usuario');
var verificacionSchema = require('../models/verificaciones');
//var jwt = require('../services/jwt');
var clienteSchema = require('../models/cliente');
var cuentaCorrienteSchema = require('../models/cuentaCorriente');
var cuentaAhorrosSchema = require('../models/cuentaAhorros');
var cuentaVinculadaSchema = require('../models/cuentaVinculada');
var transferenciaSchema = require('../models/transferencia');
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

        //Verificar si el cliente ya existe en la base de datos
        const clienteExiste = await clienteSchema.findOne({ cedula: cedula });
        //Si el cliente existe entonces se debe verificar que el tipo de cuenta no exista
        //Se debe tener 1 tipo de cuenta por cliente maximo
        if(clienteExiste){
            if((clienteExiste.cuentaCorriente != null && tipoCuenta == "Corriente") || (clienteExiste.cuentaAhorros != null && tipoCuenta == "Ahorros") || (clienteExiste.cuentaVinculada != null && tipoCuenta == "Vinculada")){
                return res.status(409).send({message: 'El cliente ya tiene una cuenta de este tipo!'});
            }
            else{
                //Si el cliente existe pero no tiene el tipo de cuenta entonces se crea
                switch(tipoCuenta) {
                    case "Corriente":
                        cuenta = new cuentaCorrienteSchema({numeroCuenta: numeroCuenta});
                        break;
                    case "Ahorros":
                        cuenta = new cuentaAhorrosSchema({numeroCuenta: numeroCuenta});
                        break;
                    case "Vinculada":
                        cuenta = new cuentaVinculadaSchema({numeroCuenta: numeroCuenta});
                        break;
                    default:
                        return res.status(400).send({message: 'Tipo de cuenta inválido'});
                }
                //Se crea la cuenta
                cuenta.save((err, accountStored) => {
                    if(err) return res.status(500).send({message: 'Error!'});
                    if(!accountStored) return res.status(404).send({message: 'Error!'});
                    //Se asigna el id_cuenta correspondiente al cliente y se actualiza el cliente
                    switch(tipoCuenta) {
                        case "Corriente":
                            clienteExiste.cuentaCorriente = accountStored._id;
                            clienteExiste.save((err, clienteStored) => {
                                if(err) return res.status(500).send({message: 'Error!'});
                                if(!clienteStored) return res.status(404).send({message: 'Error!'});
                                return res.status(200).send({message: "Proceso exitoso"});
                            });
                            break;
                        case "Ahorros":
                            clienteExiste.cuentaAhorros = accountStored._id;
                            clienteExiste.save((err, clienteStored) => {
                                if(err) return res.status(500).send({message: 'Error!'});
                                if(!clienteStored) return res.status(404).send({message: 'Error!'});
                                return res.status(200).send({message: "Proceso exitoso"});
                            });
                            break;
                        case "Vinculada":
                            clienteExiste.cuentaVinculada = accountStored._id;
                            clienteExiste.save((err, clienteStored) => {
                                if(err) return res.status(500).send({message: 'Error!'});
                                if(!clienteStored) return res.status(404).send({message: 'Error!'});
                                return res.status(200).send({message: "Proceso exitoso"});
                            });
                            break;
                        default:
                            return res.status(400).send({message: 'Error al crear la cuenta'});
                    }  
                });
                
            }
        }else{
            //Si el cliente no existe entonces se crea su esquema
            var cliente = new clienteSchema({cedula, nombres, apellidos, correo});
            //Se crea la cuenta
            if(tipoCuenta == "Corriente"){
                var cuenta = new cuentaCorrienteSchema({numeroCuenta: numeroCuenta});
                await cuenta.save((err, accountStored) => {
                    if(err) return res.status(500).send({message: 'Error!'});
                    if(!accountStored) return res.status(404).send({message: 'Error!'});
                    cliente.cuentaCorriente = accountStored._id;
                    cliente.save((err, clienteStored) => {
                        if(err) return res.status(500).send({message: 'Error!'});
                        if(!clienteStored) return res.status(404).send({message: 'Error!'});
                        return res.status(200).send({message: "Proceso exitoso"});
                    });
                });
            }else if(tipoCuenta == "Ahorros"){
                var cuenta = new cuentaAhorrosSchema({numeroCuenta: numeroCuenta});
                await cuenta.save((err, accountStored) => {
                    if(err) return res.status(500).send({message: 'Error!'});
                    if(!accountStored) return res.status(404).send({message: 'Error!'});
                    cliente.cuentaAhorros = accountStored._id;
                    cliente.save((err, clienteStored) => {
                        if(err) return res.status(500).send({message: 'Error!'});
                        if(!clienteStored) return res.status(404).send({message: 'Error!'});
                        return res.status(200).send({message: "Proceso exitoso"});
                    });
                });
                
            }else if(tipoCuenta == "Vinculada"){
                var cuenta = new cuentaVinculadaSchema({numeroCuenta: numeroCuenta});
                await cuenta.save((err, accountStored) => {
                    if(err) return res.status(500).send({message: 'Error!'});
                    if(!accountStored) return res.status(404).send({message: 'Error!'});
                    cliente.cuentaVinculada = accountStored._id;
                    cliente.save((err, clienteStored) => {
                        if(err) return res.status(500).send({message: 'Error!'});
                        if(!clienteStored) return res.status(404).send({message: 'Error!'});
                        return res.status(200).send({message: "Proceso exitoso"});
                    });
                });
            }
        }
    },
    
    createUsuario: async function(req, res){
        var usuario = req.body.usuario;
        let contrasena = req.body.contrasena;

        //Codigo para verificar la creacion de un usuario
        const codigo = await verificacionSchema.findOne

        //Verificar si el usuario ya existe
        const user = await usuarioSchema.findOne({ cedula: cedula });
        if(user){
            return res.status(400).send({message: 'El usuario ya existe!'});
        }
        
        //Funcion para convertir la contraseña en hash
        async function hashPassword(contrasena) {
            try {
              const salt = await bcrypt.genSalt(10);
              const hash = await bcrypt.hash(contrasena, salt);
              return hash;
            } catch (error) {
              console.log(error);
            }
          }
        //Convertir la contraseña en hash
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