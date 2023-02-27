const express = require("express");
var router = express.Router();
var bancamovilRouter = require("../controllers/bancamovil.controller");


// Create a new Account
router.post("/createAccount", bancamovilRouter.createAccount);
// Verify if a client exists
router.get("/verifyClient", bancamovilRouter.verificarCliente);
//Create a verification code
router.post("/createCode", bancamovilRouter.createCodigo);
// Verify a verification code
router.get("/verifyCode/:code", bancamovilRouter.verificarCodigo);
// Create a new User
router.post("/createUser/:idCodigo", bancamovilRouter.createUsuario);
// Login a User
router.post("/login", bancamovilRouter.loginUser);
// Find an account
router.post("/findData", bancamovilRouter.findData);
// Update data
router.post("/updateData", bancamovilRouter.updateData);
// Transfer money
router.post("/transfer", bancamovilRouter.transferirDinero);

module.exports = router;