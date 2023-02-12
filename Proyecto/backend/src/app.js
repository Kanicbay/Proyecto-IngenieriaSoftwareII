'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bancamovilRoutes = require('./routes/bancamovil.routes');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, X-Request-With, Content-Type,Accept, Access-Control-Allow, Request-Method')
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/', bancamovilRoutes);
module.exports = app;