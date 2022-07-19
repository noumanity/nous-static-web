const express=require('express');
const yaml = require('js-yaml');
const fs=require('fs');
const crypto=require('crypto');
var body_parser = require('body-parser');
let esquema_formulario = '';
let esquema_formulario_sitio = '';
const path_contenidos_blog = './contenidos/blog';
const path_contenidos_sitio = './contenidos/nous_static_web';
try {
    esquema_formulario = yaml.load(fs.readFileSync('ejemplo_blog.schema.yml', 'utf-8'));
    esquema_formulario_sitio = yaml.load(fs.readFileSync('nous_static_web.schema.yml', 'utf-8'));
  } catch (e) {
    console.log(e);
  }    
app=express();
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/'));
app.use(body_parser.urlencoded({extended:true}));


app.get('/',(req, res) => {
  res.render('index');
});

app.get('/blog/contenido',(req, res) => {
  let files = fs.readdirSync(path_contenidos_blog);
  let content;
  let files_data=[]; 
  files.forEach(element => {
    content = yaml.load(fs.readFileSync(path_contenidos_blog+'/'+element, 'utf-8')); 
    let result = element.substring(13);
    let result2 = result.slice(0, -4);
    var objeto =   {
      archivo: result2, 
      titulo: content.data.articulo.titulo,
      subtitulo: content.data.articulo.subtitulo,
      fecha: content.data.articulo.fecha,
    }
    files_data.push(objeto);
  });
  res.render('blog_contenido', {files_data: files_data});
});

app.get('/blog/nuevo',(req, res) => {
  res.render('blog_nuevo', {formulario:  JSON.stringify(esquema_formulario, 'utf-8')});
});

app.get('/blog/edicion/:archivo_id',(req, res) => {
  let archivo_id = req.params.archivo_id;
  content = yaml.load(fs.readFileSync(path_contenidos_blog+'/ejemplo_blog_'+archivo_id+'.yml', 'utf-8')); 
  res.render('blog_edicion', {formulario:  JSON.stringify(esquema_formulario, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8')});
});

app.get('/blog/diseno',(req, res) => {
  res.render('index', {formulario:  JSON.stringify(esquema_formulario, 'utf-8')});
});

//Sitio web
app.get('/sitio/contenido',(req, res) => {
  let files = fs.readdirSync(path_contenidos_sitio);
  let content;
  let files_data=[]; 
  files.forEach(element => {
    content = yaml.load(fs.readFileSync(path_contenidos_sitio+'/'+element, 'utf-8')); 
    let result = element.substring(13);
    let result2 = result.slice(0, -4);
    var objeto =   {
      archivo: result2, 
      titulo: content.data.pagina.titulo,
      subtitulo: content.data.pagina.subtitulo,
      fecha: content.data.pagina.fecha,
    }
    files_data.push(objeto);
  });
  res.render('nous_static_web_contenido', {files_data: files_data});
});

app.get('/sitio/edicion/:archivo_id',(req, res) => {
  let archivo_id = req.params.archivo_id;
  content = yaml.load(fs.readFileSync(path_contenidos_sitio+'/ejemplo_blog_'+archivo_id+'.yml', 'utf-8')); 
  res.render('nous_static_web_edicion', {formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8'), formulario_values:  JSON.stringify(content, 'utf-8')});
});

app.get('/sitio/nuevo',(req, res) => {
  res.render('nous_static_web_nuevo', {formulario:  JSON.stringify(esquema_formulario_sitio, 'utf-8')});
});

app.get('/sitio/diseno',(req, res) => {
  res.render('index', {formulario:  JSON.stringify(esquema_formulario, 'utf-8')});
});

app.post('/save-values',(req, res) => {
  var id = crypto.randomBytes(5).toString('hex');
  const outputfile = 'ejemplo_blog_'+id+'.yml';
  //const outputfile_values = 'ejemplo_blog_values_'+id+'.yml';
  fs.writeFileSync(path_contenidos_blog+'/'+outputfile, yaml.dump(req.body.values));
  //fs.writeFileSync(path_contenidos_blog+'/'+outputfile, yaml.dump(req.body.body));
  return true;
});

app.post('/save-values-sitio',(req, res) => {
  var id = crypto.randomBytes(5).toString('hex');
  const outputfile = 'ejemplo_blog_'+id+'.yml';
  //const outputfile_values = 'ejemplo_blog_values_'+id+'.yml';
  fs.writeFileSync(path_contenidos_sitio+'/'+outputfile, yaml.dump(req.body.values));
  //fs.writeFileSync(path_contenidos_blog+'/'+outputfile, yaml.dump(req.body.body));
  return true;
});




app.listen(3000);
console.log('Servidor corriendo en el puerto 3000');
