//Rutas
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Historia = require('../models/historia');

// =====================================================
// Mostrar todo el historial
// =====================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Historia.find({}).populate('sistema').skip(desde).limit(5).exec(
      (err, autos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando auto',
            errors: err
          });
        }
        Auto.count({}, (err, conteo)=>{
            res.status(200).json({
            ok: true,
            autos: autos,
            total: conteo
            });
        });
      });
  });

// =====================================================
// Mostrar todo el historial por id 
// =====================================================
  app.get('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    Historia.findById(id, {}).populate('sistema').skip(desde).limit(5).exec(
      (err, historial) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando auto',
            errors: err
          });
        }
        Historia.count({}, (err, conteo)=>{
            res.status(200).json({
            ok: true,
            historial: historial,
            total: conteo
            });
        });
      });
  });