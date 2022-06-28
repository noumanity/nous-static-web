const express=require('express');
const yaml = require('js-yaml');
const fs=require('fs');
var body_parser = require('body-parser');
let esquema_formulario = '';
try {
    esquema_formulario = yaml.load(fs.readFileSync('ejemplo_blog.schema.yml', 'utf-8'));
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
    res.render('index', {formulario:  JSON.stringify(esquema_formulario, 'utf-8')});
});

app.post('/save-values',(req, res) => {
  const outputfile = 'ejemplo_blog.yml';
  fs.writeFileSync(outputfile, yaml.dump(req.body.body));
  return true;
});

app.listen(3000);
console.log('Servidor corriendo en el puerto 3000');
