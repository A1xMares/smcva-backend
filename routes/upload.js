//Rutas
var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Sistema = require('../models/sistema');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tpos de coleccion
    var tiposValidos = ['usuarios', 'sistemas']
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: {message: 'Tipo de colección no es válida'}
          });
    }

    if(!req.files){
            return res.status(400).json({
              ok: false,
              mensaje: 'No seleccinó nada',
              errors: {message: 'No seleccionó una imagen'}
            });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Validación extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if(extensionesValidas.indexOf(extensionArchivo) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: {message: 'Las extensiones válidas son ' + extensionesValidas.join(', ')}
          });
    }
    
    //nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`; 

    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
              });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });
  });

  function subirPorTipo(tipo, id, nombreArchivo, res){

    if(tipo == 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{
            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: {message: 'Uusuario no existe'}
                  });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //Elimina vieja imagen
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = '';
                return res.status(200).json({
                    ok: false,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                  });
            });
        });
    }
    if(tipo == 'sistemas'){
        Sistema.findById(id, (err, sistema)=>{
            if(!sistema){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El sistema no existe',
                    errors: {message: 'sistema no existe'}
                  });
            }
            var pathViejo = './uploads/sistemas/' + sistema.img;
            //Elimina vieja imagen
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            sistema.img = nombreArchivo;
            sistema.save((err, sistemaActualizado) => {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'Imagen de sistema actualizada',
                    sistema: sistemaActualizado
                });
            });
        });
    }
  } 

module.exports = app;