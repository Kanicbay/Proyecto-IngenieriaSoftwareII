const express = require("express");
var router = express.Router();
var bancamovilRouter = require("../controllers/bancamovil.controller");


// Create a new Account
router.post("/createAccount", bancamovilRouter.createAccount);
// Create a new User
router.post("/createUser", bancamovilRouter.createUsuario);
// Login a User
router.get("/login", bancamovilRouter.loginUser);
// Find an account
router.get("/findAccount", bancamovilRouter.findAccount);
// Transfer money
router.post("/transfer", bancamovilRouter.transferirDinero);

module.exports = router;