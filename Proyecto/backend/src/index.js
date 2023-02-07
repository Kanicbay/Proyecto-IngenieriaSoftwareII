'use strict'
const express = require('express');
const mongoose = require('mongoose');
var bodyParser=require('body-parser');
require("dotenv").config();
const accountRoutes = require('./routes/cuenta');

mongoose.set("strictQuery",false);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//middlewares
app.use('/api', accountRoutes)
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

//connect to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(()=>console.log('Conectado a la base de datos de Mongo Atlas'))
  .catch((err)=>console.log(err));

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port);
});
