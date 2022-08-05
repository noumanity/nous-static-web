'use strict'

const app = require('./app');

//Configuración del puerto
app.set('port', process.env.PORT || 3000);

//Creación del servidor
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto http://localhost:'+app.get('port')+', funcionando!!!!');
});

