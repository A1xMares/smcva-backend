//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS ");
  next();
});

//bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

var sistemaRoutes = require('./routes/sistema');
var historiaRoutes = require('./routes/historia');

var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

var buscarRoutes = require('./routes/buscar');

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
app.use('/busqueda', buscarRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/sistema', sistemaRoutes);
app.use('/historia', historiaRoutes);

//Conexión a la bdd
mongoose.connection.openUri('mongodb://localhost:27017/app-smcva', (err, res)=>{
  if(err){
    throw err;
  }
  console.log('\x1b[35m Base de datos: \x1b[36m', 'online \x1b[0m');
});

//Escuchar peticiones
app.listen(3501, ()=> {
  console.log('\x1b[35m Express server \x1b[0m puerto 3501: \x1b[36m', 'online \x1b[0m');
});
