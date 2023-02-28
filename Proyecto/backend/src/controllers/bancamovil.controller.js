'use strict'
var usuarioSchema = require('../models/usuario');
var verificacionSchema = require('../models/verificaciones');
var { tokenSign, verifyToken } = require('../services/generateToken');
var clienteSchema = require('../models/cliente');
var cuentaCorrienteSchema = require('../models/cuentaCorriente');
var cuentaAhorrosSchema = require('../models/cuentaAhorros');
var cuentaVinculadaSchema = require('../models/cuentaVinculada');
var transferenciaSchema = require('../models/transferencia');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var {v4: uuidv4} = require('uuid');
require('dotenv').config();

var controller = {
    //Crear una cuenta
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

    //Verificar que existe el cliente
    async verificarCliente(req, res){
        const cuenta = req.body.numeroCuenta;
        
        const clienteExisteAhorros = await cuentaAhorrosSchema.findOne({numeroCuenta: cuenta});
        if(clienteExisteAhorros){
            return res.status(200).send({message: "Proceso exitoso"});
        }
        const clientExisteCorriente = await cuentaCorrienteSchema.findOne({numeroCuenta: cuenta});
        if(clientExisteCorriente){
            return res.status(200).send({message: "Proceso exitoso"});
        }
        const clienteExisteVinculada = await cuentaVinculadaSchema.findOne({numeroCuenta: cuenta});
        if(clienteExisteVinculada){
            return res.status(200).send({message: "Proceso exitoso"});
        }
        return res.status(404).send({message: "Error!"});
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

        //Verificar si el codigo ingresado existe o por algun problema ya caduco
        const verificacion = await verificacionSchema.findById((idCodigo));
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
        //Crear token de sesion
        //const tokenSession = await tokenSign(user);
        await jwt.sign({cliente: user.cliente}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, tokenSession) => {
            if(err){
                console.log(err);
                res.status(500).send({message: 'Error!'});
            } else{
                console.log("Este es el token: ", tokenSession);
                console.log("Este es el tipo de token: ", typeof tokenSession);
                return res.status(200).send({message: 'Proceso exitoso', token: tokenSession});
            }
        });

        
        //console.log("Este es el token: ", tokenSession);
        //console.log("Este es el tipo de token: ", typeof tokenSession);
        //return res.status(200).send({message: 'Proceso exitoso', token: tokenSession});
    },

    findData: async function (req, res) {
        try {
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];
          if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.' });
          }
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          if (!decodedToken) {
            return res.status(403).send({ message: 'Error!' });
          }
          // verificar fecha de expiración del token
          const now = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < now) {
            return res.status(401).send({ auth: false, message: 'Token expired.' });
          }      
          const numeroCliente = decodedToken.cliente;
          const cliente = await clienteSchema.findById(numeroCliente);
          if (!cliente) {
            return res.status(404).json({ message: 'Error!' });
          }
          const cuentas = await Promise.all([
            cuentaAhorrosSchema.findById(cliente.cuentaAhorros),
            cuentaCorrienteSchema.findById(cliente.cuentaCorriente),
            cuentaVinculadaSchema.findById(cliente.cuentaVinculada),
          ]);
          if (!cuentas[0] && !cuentas[1] && !cuentas[2]) {
            return res.status(404).json({ message: 'Error!' });
          }
          const user = await usuarioSchema.findOne({ cliente: numeroCliente  });
          if (!user) {
            return res.status(404).json({ message: 'Error!' });
          }
          return res.status(200).send({ message: 'Proceso exitoso', cuentas: cuentas, cliente: cliente, usuario: user.usuario });
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(410).send({ auth: false, message: 'Token expired.' });
            }
            if(error.name === 'JsonWebTokenError'){
                return res.status(403).send({ message: 'Error!' });
            }
            return res.status(500).send({ message: 'Error!' });
        }
    },

    updateData: async function (req, res) {
        try {
            //Obtener el token de headers
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            //Verificar si el token fue dado
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided.' });
            }
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken) {
                return res.status(403).send({ message: 'Error!' });    //El token no es valido
            }
            // verificar fecha de expiración del token
            const now = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < now) {
                return res.status(401).send({ auth: false, message: 'Token expired.' }); //El token expiro
            }
            //Encontrar el cliente
            const numeroCliente = decodedToken.cliente;
            const cliente = await clienteSchema.findById(numeroCliente);
            if (!cliente) {
                return res.status(404).json({ message: 'Error!' });
            }
            //Actualizar los datos del cliente si es necesario
            var actualizarCliente = false;
            var clienteActualizado = req.body.cliente;  //Usuario del frontend
            switch(clienteActualizado){
                case clienteActualizado.nombres != null:
                    cliente.set("nombres", clienteActualizado.nombres);
                    actualizarCliente = true;
                    break;
                case clienteActualizado.apellidos != null:
                    cliente.set("apellidos", clienteActualizado.apellidos);
                    actualizarCliente = true;
                    break;
                case clienteActualizado.correo != null:
                    cliente.set("correo", clienteActualizado.correo);
                    actualizarCliente = true;
                    break;
            }
            if(actualizarCliente){
                clienteNuevo = await cliente.save();
                if(!clienteNuevo){
                    return res.status(404).json({ message: 'Error!' });
                }
            }

            //Actualizar los datos del usuario si es necesario
            const usuario = await usuarioSchema.findOne({ cliente: numeroCliente  });
            var actualizarUsuario = false;
            var usuarioActualizado = req.body.usuario;  //Usuario del frontend
            switch(usuarioActualizado){
                case usuarioActualizado.usuario != null:
                    cliente.set("usuario", usuarioActualizado.usuario);
                    actualizarUsuario = true;
                    break;
                case usuarioActualizado.contrasena != null:
                    cliente.set("contrasena", usuarioActualizado.contrasena);
                    actualizarUsuario = true;
                    break;
            }
            if(actualizarUsuario){
                usuarioNuevo = await usuario.save();
                if(!usuarioNuevo){
                    return res.status(404).json({ message: 'Error!' });
                }
            }
            return res.status(200).send({ message: 'Proceso exitoso'});
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(410).send({ auth: false, message: 'Token expired.' });
            }
            if(error.name === 'JsonWebTokenError'){
                return res.status(403).send({ message: 'Error!' });
            }
            return res.status(500).send({ message: 'Error!' });
        }
    },

    transferirDinero : async function(req, res){
        var numeroCuentaOrigen = req.body.numeroCuentaOrigen;
        var numeroCuentaDestino = req.body.numeroCuentaDestino;
        var monto = req.body.monto;
        var tipoCuenta = req.body.tipoCuentaOrigen;
        console.log(numeroCuentaOrigen, numeroCuentaDestino, monto);

        const clienteExisteAhorros = await cuentaAhorrosSchema.findOne({numeroCuenta: numeroCuentaDestino});
        if(clienteExisteAhorros){
            const dataOrigen = await cuentaAhorrosSchema.findOne({ numeroCuenta: numeroCuentaOrigen });
            if (!dataOrigen) {
                return res.status(404).json({ message: "Error!" });
            }

            if(dataOrigen.saldo == 0 || dataOrigen.saldo < monto){
                return res.status(404).json({ message: "Error Saldo insuficiente" });
            }
            else{
                dataOrigen.saldo = parseFloat(dataOrigen.saldo) - parseFloat(monto);
                clienteExisteAhorros.saldo = parseFloat(clienteExisteAhorros.saldo) + parseFloat(monto);
                console.log(dataOrigen.saldo);
                console.log(clienteExisteAhorros.saldo);
    
                await dataOrigen.save();
                await clienteExisteAhorros.save();
                return res.status(200).send({message: "Proceso exitoso"});
            }        
            
        }
        const clientExisteCorriente = await cuentaCorrienteSchema.findOne({numeroCuenta: numeroCuentaDestino});
        if(clientExisteCorriente){
            const dataOrigen = await cuentaAhorrosSchema.findOne({ numeroCuenta: numeroCuentaOrigen });
            if (!dataOrigen) {
                return res.status(404).json({ message: "Error!" });
            }

            if(dataOrigen.saldo == 0 || dataOrigen.saldo < monto){
                return res.status(404).json({ message: "Error Saldo insuficiente" });
            }
            else{
                dataOrigen.saldo = parseFloat(dataOrigen.saldo) - parseFloat(monto);
                clientExisteCorriente.saldo = parseFloat(clientExisteCorriente.saldo) + parseFloat(monto);
                console.log(dataOrigen.saldo);
                console.log(clientExisteCorriente.saldo);
    
                await dataOrigen.save();
                await clientExisteCorriente.save();
                return res.status(200).send({message: "Proceso exitoso"});
            }        
        }
        const clienteExisteVinculada = await cuentaVinculadaSchema.findOne({numeroCuenta: numeroCuentaDestino});
        if(clienteExisteVinculada){
            const dataOrigen = await cuentaAhorrosSchema.findOne({ numeroCuenta: numeroCuentaOrigen });
            if (!dataOrigen) {
                return res.status(404).json({ message: "Error!" });
            }

            if(dataOrigen.saldo == 0 || dataOrigen.saldo < monto){
                return res.status(404).json({ message: "Error Saldo insuficiente" });
            }
            else{
                dataOrigen.saldo = parseFloat(dataOrigen.saldo) - parseFloat(monto);
                clienteExisteVinculada.saldo = parseFloat(clienteExisteVinculada.saldo) + parseFloat(monto);
                console.log(dataOrigen.saldo);
                console.log(clienteExisteVinculada.saldo);
    
                await dataOrigen.save();
                await clienteExisteVinculada.save();
                return res.status(200).send({message: "Proceso exitoso"});
            }        
        }
        return res.status(404).send({message: "Error!"});


        
        
        
        return res.status(200).send({message: 'Proceso exitoso'});
    },

}

module.exports = controller;