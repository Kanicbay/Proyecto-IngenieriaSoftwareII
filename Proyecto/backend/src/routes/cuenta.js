const express = require("express");
const cuentaSquema = require("../models/cuenta");
const usuarioSquema = require("../models/usuario");
const bcrypt = require("bcrypt");


const router = express.Router();

// Create cuenta
router.post("/cuentas", (req, res) => {
    const cuenta = cuentaSquema(req.body);
    cuenta
      .save()
      .then(() => res.json("Cuenta creada"))
      .catch((err) => res.json({message: err}));

});

//Create usuario
router.post("/cuentas/usuario", async (req, res) => {
    const cedula = req.body.cedula;
    const usuario = req.body.usuario;
    let contrasena = req.body.contrasena;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(contrasena, salt, (err, hash) => {
            if (err) throw err;
            contrasena = hash;
        });
    });

    const cuenta = await cuentaSquema.findOne({ cedula: cedula });
    if (!cuenta) {
        return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    const cuentaId = cuenta._id;

    const data = new usuarioSquema({
        usuario: usuario,
        contrasena: contrasena,
        cuenta: cuentaId,
    });

    data
      .save()
      .then((data) => res.json({ message: "Usuario creado" }))
      .catch((err) => res.json({message: err}));

});

// Get usuario
router.get("/cuentas/usuario", async (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    const data = await usuarioSquema.findOne({ usuario: usuario });
    if (!data) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    bcrypt.compare(contrasena, data.contrasena, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            res.json({ message: "Usuario encontrado" });
        } else {
            res.json({ message: "Contraseña incorrecta" });
        }
    });
});

module.exports = router;