const express = require("express");
var router = express.Router();
var envio = require("../controllers/correo.controller");

router.post('/envioCorreo', envio.envioCorreo);

module.exports = router;