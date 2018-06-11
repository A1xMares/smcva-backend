//Rutas
var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');
var Sistema = require('../models/sistema');
var Usuario = require('../models/usuario');
// =====================================================
// Busqueda específica
// =====================================================
app.get('/coleccion/:tabla/:busqueda', mdAutenticacion.verificaToken, (req, res) => {
    var Usuario = req.usuario._id;
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch(tabla){
        case 'sistemas':
            promesa = buscarSistemas(busqueda, regex, Usuario);
        break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: {message:'Tipo de tabla/coleccion no válido'}               
            });
        break;
    }   
    promesa.then(data =>{
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// =====================================================
// Busqueda general
// =====================================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all([
        buscarHospitales(busqueda, regex), 
        buscarMedicos(busqueda, regex), 
        buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
  });

  function buscarSistemas(busqueda, regex, usuario){
    return new Promise((resolve, reject) => {
        Sistema.find({'usuario':usuario}).or([{'apodo': regex}, {'modelo': regex}, {'numserie': regex}]).exec((err, sistemaAutos)=>{
            if(err){
                reject('Error al cargar sistemas');
            } else {
                    resolve(sistemaAutos);
            }
        });
    });
  }


  module.exports = app;