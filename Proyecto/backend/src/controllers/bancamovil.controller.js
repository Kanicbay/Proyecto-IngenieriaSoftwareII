'use strict'
var usuarioSchema = require('../models/usuario');
var verificacionSchema = require('../models/verificaciones');
var jwt = require('../services/generateToken');
var clienteSchema = require('../models/cliente');
var cuentaCorrienteSchema = require('../models/cuentaCorriente');
var cuentaAhorrosSchema = require('../models/cuentaAhorros');
var cuentaVinculadaSchema = require('../models/cuentaVinculada');
var transferenciaSchema = require('../models/transferencia');
var bcrypt = require('bcrypt');
var {v4: uuidv4} = require('uuid');

var controller = {
    //Crear una cuenta
    createAccount: async function(req, res){
        var numeroCuenta = parseInt(uuidv4(), 16);
        var nombres = req.body.nombres;
        var apellidos = req.body.apellidos;
        var cedula = req.body.cedula;
        var correo = req.body.correo;
        var tipoCuenta = req.body.tipoCuenta;
        console.log("Entre al proceso de crear cuenta!");

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

    //Verificar que existe el cliente
    async verificarCliente(req, res){
        const { cedula } = req.params;
        const user = await usuarioSchema.findOne({ cedula: cedula });
        if(user){
            return res.status(200).send({message: 'El cliente existe'});
        }else{
            return res.status(409).send({message: 'El cliente no existe'});
        }
    },

    //Crear codigo de verificacion
    async createCodigo(req, res){
        const cedula = req.body.cedula;
        const uuidv4 = require('uuid').v4;
        const codigoVerificacion = uuidv4().slice(0, 6);
/*        const codigoExiste = await verificacionSchema({cedula: cedula});
        console.log(codigoExiste);
        if(codigoExiste){
            return res.status(200).send({message: "Proceso exitoso", codigo: codigoExiste.codigo_verificacion});
        }*/
        const codigo = new verificacionSchema({cedula: cedula, codigo: codigoVerificacion});
        await codigo.save((err, codigoStored) => {
            if(err) return res.status(500).send({message: 'Error!'});
            if(!codigoStored) return res.status(404).send({message: 'Error!'});
            return res.status(200).send({message: "Proceso exitoso", codigo: codigoStored});
        });
    },
        
    async verificarCodigo(req, res){
        const { code } = req.params;
        const verificacion = await verificacionSchema.findOne({ codigo_verificacion: code });
        if(verificacion){
            return res.status(200).send({message: 'El codigo existe'});
        }else{
            return res.status(409).send({message: 'El codigo no existe'});
        }
    },
    
    //Crear usuario
    createUsuario: async function(req, res){
        //Obtener codigo de verificacion de parametros y datos del usuario
        var { idCodigo } = req.params;
        var usuario = req.body.usuario;
        let contrasena = req.body.contrasena;

        console.log("Parametros ", idCodigo);
        console.log("Codigo de verificacion id: ", (idCodigo));

        //Verificar si el codigo ingresado existe o por algun problema ya caduco
        const verificacion = await verificacionSchema.findById((idCodigo));
        console.log("Codigo de verificacion: ", (verificacion));
        if(!verificacion){
            return res.status(404).json({ message: "El codigo de verifcacion caduco" });
        }
        //Verificar si el usuario ya existe
        var cedula = verificacion.cedula;
        const user = await usuarioSchema.findOne({ cedula: cedula });
        if(user){
            return res.status(409).send({message: 'El usuario ya existe'});
        }
        //Verificar si la cedula tiene un cliente asociado
        const cliente = await clienteSchema.findOne({ cedula: cedula });
        if (!cliente) {
            return res.status(404).json({ message: "No tiene una cuenta asociada al número de cédula" });
        }
        var clienteId = cliente._id;
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
        //Crear el esquema del usuario
        var data = new usuarioSchema({
            usuario: usuario,
            contrasena: contrasena,
            cliente: clienteId,
        });
        //Eliminar el codigo de verificacion
        await verificacionSchema.findByIdAndDelete(verificacion._id);
        //Guardar el usuario
        data.save((err, usuarioStored) => {
            if(err) return res.status(500).send({message: 'Error!'});
            if(!usuarioStored) return res.status(404).send({message: 'Error!'});
            return res.status(200).send({message: "Proceso Exitoso"});
        });
        
    },

    loginUser: async function(req, res){
        var usuario = req.body.usuario;
        var contrasena = req.body.contrasena;

        const user = await usuarioSchema.findOne({ usuario: usuario });
        if (!user) {
            return res.status(404).json({ message: "Error!" });
        }
        bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
            if(err) throw err;
            if(!isMatch){
                return res.status(404).send({message: 'Error!!'});
            }
        });
        console.log(user._id);
        //Crear token de sesion
        const tokenSession = await jwt.tokenSign(user);

        return res.status(200).send({message: 'Proceso exitoso', token: tokenSession});
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