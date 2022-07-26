'use strict'

const app = require('./app');
const port = process.env.PORT || 3000;
const yaml = require('js-yaml');
const fs=require('fs');
const crypto=require('crypto');
const passport = require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const PassportLocal = require('passport-local').Strategy;
const bcrypt=require('bcryptjs');

let esquema_formulario = '';
let esquema_formulario_sitio = '';
const path_contenidos_blog = './contenidos/blog';
const path_contenidos_sitio = './contenidos/nous_static_web';
const path_build_index = './views/index_build.ejs';
try {
    esquema_formulario = yaml.load(fs.readFileSync('./schemas/blog.schema.yml', 'utf-8'));
    esquema_formulario_sitio = yaml.load(fs.readFileSync('./schemas/nous_static_web.schema.yml', 'utf-8'));
  } catch (e) {
    console.log(e);
  }    

const readJSON = (username, password) => {
  try {
    const data = yaml.load(fs.readFileSync('./database/usuarios.yml', 'utf-8'));
    for(let i = 0; i < data.usuarios.length; i++) {
      
      if (data.usuarios[i].usuario == username && compare(password, data.usuarios[i].contrasena)){
        return data.usuarios[i];
      }
    }
    return false;
  } catch (error) {
    fs.writeFileSync('./database/usuarios.yml', yaml.dump(data));
  }
};

//Se usará cuando esté habilitado el registro de usuarios
const encrypt = async(textPlain) => {
  const hash = await bcrypt.hash(textPlain,10);
  return hash;
}

const compare = async(passwordPlain, hashPassword) => {
  return await bcrypt.compare(passwordPlain, hashPassword)
}
  

//app.use(express.urlencoded({extended:true}));
app.use(cookieParser('hashsecreto'));
app.use(session({
  secret: 'hashsecreto',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
/**********/
passport.use(new PassportLocal(function(username,password,done){
  let validacion = readJSON(username, password);
  if(validacion)
    return done(null, {id: validacion.id, nombre: validacion.nombre, rol:validacion.rol});
  done(null, false);
}));

// 1 => Serialización
passport.serializeUser(function(user, done){
  done(null, {id:user.id, nombre:user.nombre, rol:user.rol});
});

//Deserealización
passport.deserializeUser(function(id, done){
  done(null, {id: 1, nombre: "Sistema", rol: "Administrativo"});
});
/**********/
//app.set('view engine', 'ejs');
//app.engine('ejs', require('ejs').__express);
/**********/
//app.set('views', __dirname+'/views');
//app.use(express.static(__dirname+'/'));


app.get('/',(req, res) => {
  if (fs.existsSync(path_build_index)) {
    res.render('index_build');
  }else{
    res.render('index_default');
  }
});

app.get('/panel_administrativo', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}, (req, res) => {
    let sessionUsuario = req.session.passport.user;
    res.render('panel_administrativo', {usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});


app.get('/login',(req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local',
{
  successRedirect: "/panel_administrativo",
  failureRedirect: "/login"
}), (req, res) => {
  
});

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});



app.get('/blog/contenido', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let files = fs.readdirSync(path_contenidos_blog);
  let content;
  let files_data=[]; 
  files.forEach(element => {
    content = yaml.load(fs.readFileSync(path_contenidos_blog+'/'+element, 'utf-8')); 
    let result = element.substring(9);
    let result2 = result.slice(0, -4);
    var objeto =   {
      archivo: result2, 
      titulo: content.data.articulo.titulo,
      subtitulo: content.data.articulo.subtitulo,
      fecha: content.data.articulo.fecha,
    }
    files_data.push(objeto);
  });
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('blog_contenido', {files_data: files_data, usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/blog/nuevo', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('blog_nuevo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/blog/edicion/:archivo_id', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let archivo_id = req.params.archivo_id;
  content = yaml.load(fs.readFileSync(path_contenidos_blog+'/articulo_'+archivo_id+'.yml', 'utf-8')); 
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('blog_edicion', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/blog/diseno', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de contenido'){
    res.redirect("/panel_administrativo")
  }
  res.render('panel_administrativo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

//Sitio web
app.get('/sitio/contenido', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let files = fs.readdirSync(path_contenidos_sitio);
  let content;
  let files_data=[]; 
  files.forEach(element => {
    content = yaml.load(fs.readFileSync(path_contenidos_sitio+'/'+element, 'utf-8')); 
    let result = element.substring(7);
    let result2 = result.slice(0, -4);
    var objeto =   {
      archivo: result2, 
      titulo: content.data.pagina.titulo,
      subtitulo: content.data.pagina.subtitulo,
      fecha: content.data.pagina.fecha,
    }
    files_data.push(objeto);
  });
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('nous_static_web_contenido', {files_data: files_data, usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/sitio/edicion/:archivo_id', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let archivo_id = req.params.archivo_id;
  content = yaml.load(fs.readFileSync(path_contenidos_sitio+'/pagina_'+archivo_id+'.yml', 'utf-8')); 
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('nous_static_web_edicion', {formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/sitio/nuevo', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de diseño'){
    res.redirect("/panel_administrativo")
  }
  res.render('nous_static_web_nuevo', {formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.get('/sitio/diseno', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  let sessionUsuario = req.session.passport.user;
  if(sessionUsuario.rol == 'Proveedor de contenido'){
    res.redirect("/panel_administrativo")
  }
  res.render('panel_administrativo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
});

app.post('/save-values', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  var id = crypto.randomBytes(5).toString('hex');
  const outputfile = 'articulo_'+id+'.yml';
  fs.writeFileSync(path_contenidos_blog+'/'+outputfile, yaml.dump(req.body.values));
  res.redirect('/blog/contenido');
});

app.post('/save-values-sitio', (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
},(req, res) => {
  var id = crypto.randomBytes(5).toString('hex');
  const outputfile = 'pagina_'+id+'.yml';
  fs.writeFileSync(path_contenidos_sitio+'/'+outputfile, yaml.dump(req.body.values));
});



//Creación del servidor
app.listen(port, () => {
  console.log('Servidor corriendo en el puerto http://localhost:'+port+', funcionando!!!!');
});

