
const {ubicacion} = require('../paths');

const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto=require('crypto');
const yaml = require('js-yaml');
const fs = require('fs');
const path_build_index = ubicacion.build_index;
let esquema_formulario = '';
let esquema_formulario_sitio = '';
let placeholder_formulario_sitio = '';
const path_contenidos_blog = ubicacion.contenidos_blog;
const path_contenidos_sitio = ubicacion.contenidos_sitio;
let esquema_contenido_sitio = '';
let esquema_diseno_sitio = '';



try {
    esquema_formulario = yaml.load(fs.readFileSync(ubicacion.formulario_blog, 'utf-8'));
    esquema_formulario_sitio = yaml.load(fs.readFileSync(ubicacion.formulario_sitio, 'utf-8'));
    placeholder_formulario_sitio = yaml.load(fs.readFileSync(ubicacion.placeholder_formulario_sitio, 'utf-8'));
} catch (e) {
    console.log(e);
} 

router.get('/', (req, res, next) => {
    if (fs.existsSync(path_build_index)) {
        res.render('index_build');
    }else{
        res.render('index_default');
    }
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local-signin',
{
  successRedirect: "/panel_administrativo",
  failureRedirect: "/login"
}), (req, res) => {
  
});

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

router.use((req, res, next)=>{
    isAuthenticated(req, res, next);
    next();
});

router.get('/panel_administrativo', (req, res, next) => {
      let sessionUsuario = req.session.passport.user;
      res.render('panel_administrativo', {usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });

  router.get('/blog/contenido', (req, res, next) => {
    if (!fs.existsSync(path_contenidos_blog)) { 
      fs.mkdirSync(path_contenidos_blog+'/',{recursive:true});
    }
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
  
  router.get('/blog/nuevo', (req, res, next) => {
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de diseño'){
      res.redirect("/panel_administrativo")
    }
    res.render('blog_nuevo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });
  
  router.get('/blog/edicion/:archivo_id', (req, res, next) => {
    let archivo_id = req.params.archivo_id;
    content = yaml.load(fs.readFileSync(path_contenidos_blog+'/articulo_'+archivo_id+'.yml', 'utf-8')); 
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de diseño'){
      res.redirect("/panel_administrativo")
    }
    res.render('blog_edicion', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });
  
  router.get('/blog/diseno', (req, res, next) => {
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de contenido'){
      res.redirect("/panel_administrativo")
    }
    res.render('panel_administrativo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });
  
  //Sitio web
  router.get('/sitio/contenido', (req, res, next) => {
    if (!fs.existsSync(path_contenidos_sitio)) { 
      fs.mkdirSync(path_contenidos_sitio+'/',{recursive:true});
    } 
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
  
  router.get('/sitio/edicion/:archivo_id', (req, res, next) => {
    let archivo_id = req.params.archivo_id;
    content = yaml.load(fs.readFileSync(path_contenidos_sitio+'/pagina_'+archivo_id+'.yml', 'utf-8')); 
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de diseño'){
      res.redirect("/panel_administrativo")
    }
    res.render('nous_static_web_edicion', {formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol, archivo_id: archivo_id});
  });

  router.get('/sitio/vista_previa/:archivo_id', (req, res, next) => {
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de diseño'){
      res.redirect("/panel_administrativo")
    }
    let archivo_id = req.params.archivo_id;
    esquema_contenido_sitio = yaml.load(fs.readFileSync(path_contenidos_sitio+'/pagina_'+archivo_id+'.yml', 'utf-8'));
    esquema_diseno_sitio = yaml.load(fs.readFileSync(ubicacion.esquema_diseno_sitio, 'utf-8'));
    res.render('plantilla/nous_static_web', {contenido:  esquema_contenido_sitio, diseno: esquema_diseno_sitio});
  });
  
  router.get('/sitio/nuevo', (req, res, next) => {
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de diseño'){
      res.redirect("/panel_administrativo")
    }
    res.render('nous_static_web_nuevo', {placeholder: JSON.stringify(placeholder_formulario_sitio, 'utf-8'), formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });
  
  router.get('/sitio/diseno', (req, res, next) => {
    let sessionUsuario = req.session.passport.user;
    if(sessionUsuario.rol == 'Proveedor de contenido'){
      res.redirect("/panel_administrativo")
    }
    res.render('panel_administrativo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), usuario: sessionUsuario.nombre, rol: sessionUsuario.rol});
  });
  
  router.post('/save-values', (req, res, next) => {
    var id = crypto.randomBytes(5).toString('hex');
    const outputfile = 'articulo_'+id+'.yml';
    fs.writeFileSync(path_contenidos_blog+'/'+outputfile, yaml.dump(req.body.values));
    res.redirect('/blog/contenido');
  });
  
  router.post('/save-values-sitio', (req, res, next) => {
    var id = crypto.randomBytes(5).toString('hex');
    const outputfile = 'pagina_'+id+'.yml';
    fs.writeFileSync(path_contenidos_sitio+'/'+outputfile, yaml.dump(req.body.values));
    if(req.body.id){
      fs.unlinkSync(path_contenidos_sitio+'/pagina_'+req.body.id+'.yml');
    }
    res.redirect('/sitio/contenido');
  });

module.exports = router;