const express = require("express");
const cuentaSquema = require("../models/cuenta");
const usuarioSquema = require("../models/usuario");

const router = express.Router();

// Crear cuenta
router.post("/cuentas", (req, res) => {
    const cuenta = cuentaSquema(req.body);
    cuenta
      .save()
      .then((data) => res.json(data))
      .catch((err) => res.json({message: err}));
});

//Crear usuario
router.post("/cuentas/usuario", async (req, res) => {
    const cedula = req.body.cedula;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    const cuenta = await cuentaSquema.findOne({ cedula: cedula });
    if (!cuenta) {
        return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    const cuentaId = cuenta._id;
    console.log(cuentaId);

    const data = new usuarioSquema({
        usuario: usuario,
        contrasena: contrasena,
        cuenta: cuentaId,
    });

    data
      .save()
      .then((data) => res.json(data))
      .catch((err) => res.json({message: err}));
});

// Obtener usuario
router.get("/cuentas/usuario", async (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    const data = await usuarioSquema.findOne({ usuario: usuario, contrasena: contrasena });
    if (!data) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.send(data);
});

module.exports = router;