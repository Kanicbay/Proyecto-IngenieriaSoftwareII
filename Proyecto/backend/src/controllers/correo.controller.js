'use strict'
const nodeMailer = require('nodemailer');
var controller = {
    envioCorreo (req, res) {
        let body = req.body;
        let config = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            post: 465,
            secure: true,
            auth:{
                user: 'pruebaepnweb@gmail.com',
                pass: 'fsfjoirbmfqwwbxz'
            }
        });

        const opciones = {
            from: 'Banco BIG MONEY',
            subject: "Codigo para crear cuenta",
            to: body.email,
            text: "hola este es tu código para crear tu cuenta: " + body.mensaje
        };

        config.sendMail(opciones, function(error,result){
            
            if (error) return res.json({ok:false, msg:error});

            return res.json({
                ok:true,
                msg:result
            });
        })
    }
}

module.exports = controller;