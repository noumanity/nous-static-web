'use strict'

//Requires
const express=require('express');

//Ejecutar express
const app = express();

//Middlewares
app.use(express.urlencoded({extended:true}));


//Definición de engine views
/**********/
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
/**********/
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/'));

//Exportar módulo
module.exports = app;

