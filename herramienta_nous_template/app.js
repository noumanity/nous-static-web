'use strict'

//Requires
const express=require('express');
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');

require('./passport/local-auth');

//Ejecutar express
const app = express();

//Cargar archivos de rutas
const rutas = require('./routes/index');

//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(cookieParser('hashsecreto'));
app.use(session({
  secret: 'hashsecreto',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//Definición de engine views
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/'));

//Reescribir las rutas
app.use('/', rutas);


//Exportar módulo
module.exports = app;

