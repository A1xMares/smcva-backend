//Rutas
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Historia = require('../models/historia');

// =====================================================
// Crear historial desde embebido
// =====================================================

app.get('/', (req, res, next) => {
    var Sistema = req.query.sistema;
    var mov1 = req.query.Mov1;
    var mov2 = req.query.Mov2;
    var imp1 = req.query.Imp1;
    var imp2 = req.query.Imp2;
    var imp3 = req.query.Imp3;
    var imp4 = req.query.Imp4;
    var imp5 = req.query.Imp5;
    var lat = req.query.Lat;
    var lon = req.query.Lon;
    var historia = new Historia({
      sistema: Sistema,
      Mov1: mov1,
      Mov2: mov2,
      Imp1: imp1,
      Imp2: imp2,
      Imp3: imp3,
      Imp4: imp4,
      Imp5: imp5,
      Lat: lat,
      Lon: lon
    });
    historia.save((err, historiaGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al guardar en historia',
          errors: err
        });
      }
      res.status(201).json({
        ok: true,
        historia: historiaGuardado
      });
    });
  });

// =====================================================
// Mostrar historial por id 
// =====================================================
  app.get('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    Historia.find({sistema: id}).exec(
      (err, historial) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando historial',
            errors: err
          });
        }
        Historia.count({sistema: id}, (err, conteo)=>{
            res.status(200).json({
            ok: true,
            historial: historial,
            total: conteo
            });
        });
      });
  });

// =====================================================
// Borrar hitorial por id
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Historia.remove({sistema: id}).exec(
      (err, historialRemovido) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error eliminando historial',
            errors: err
          });
        }
            
        res.status(200).json({
            ok: true,
            historialRemovido: historialRemovido
        });
      });
  });

  module.exports = app;