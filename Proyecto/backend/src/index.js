'use strict'
const mongoose = require('mongoose');
const port = 3700;
mongoose.promise = global.Promise;
mongoose.set("strictQuery",false);
var app = require('./app');

require("dotenv").config();

var conexion = process.env.MONGODB_URI;

//connect to DB
mongoose
  .connect(conexion)
  .then(() => {
    console.log("Conectado a la BD de Mongo Atlas");
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto " + port);
    });
  });

  
