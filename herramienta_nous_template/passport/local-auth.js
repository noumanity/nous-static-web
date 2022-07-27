const {ubicacion} = require('../paths');
const yaml = require('js-yaml');
const fs=require('fs');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const bcrypt=require('bcryptjs');

//Se usará cuando esté habilitado el registro de usuarios
const encrypt = async(textPlain) => {
    const hash = await bcrypt.hash(textPlain,10);
    return hash;
}
  
const compare = (passwordPlain, hashPassword) => {
    return bcrypt.compareSync(passwordPlain, hashPassword);
}

const readJSON = (username, password) => {
    const data = yaml.load(fs.readFileSync(ubicacion.usuarios, 'utf-8'));
    try {
      for(let i = 0; i < data.usuarios.length; i++) {
        if (data.usuarios[i].usuario == username && compare(password, data.usuarios[i].contrasena)){
            return data.usuarios[i];
        }
      }
      return false;
    } catch (error) {
      fs.writeFileSync(ubicacion.usuarios, yaml.dump(data));
    }
  };

// Serialización
passport.serializeUser(function(user, done){
    done(null, {id:user.id, nombre:user.nombre, rol:user.rol});
});
  
//Deserealización
passport.deserializeUser(function(id, done){
    done(null, {id: 1, nombre: "Sistema", rol: "Administrativo"});
});

passport.use('local-signin', new PassportLocal(function(username,password,done){
    let validacion = readJSON(username, password);
    if(validacion)
      return done(null, {id: validacion.id, nombre: validacion.nombre, rol:validacion.rol});
    done(null, false);
  }));