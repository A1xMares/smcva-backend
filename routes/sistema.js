//Rutas
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Sistema = require('../models/sistema');

// =====================================================
// Obtener todos los sistemas
// =====================================================

app.get('/todos', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Sistema.find({}).populate('usuario').skip(desde).limit(5).exec(
      (err, sistemas) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando sistema',
            errors: err
          });
        }
        Sistema.count({}, (err, conteo)=>{
            res.status(200).json({
            ok: true,
            sistemas: sistemas,
            total: conteo
            });
        });
      });
  });

// =====================================================
// Obtener sistemas por id
// =====================================================

app.get('/', mdAutenticacion.verificaToken ,(req, res, next) => {
  var Usuario = req.usuario._id;
    Sistema.find({usuario: Usuario}).exec(
      (err, sistemaAutos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando sistemas con autos',
            errors: err
          });
        }
        Sistema.count({usuario: Usuario}, (err, conteo)=>{
            res.status(200).json({
            ok: true,
            sistemaAutos: sistemaAutos,
            total: conteo
            });
        });
      });
});

// =====================================================
// Actualizar sistema
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;
    var body = req.body;
    Sistema.findById(id, (err, sistema)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar sistema',
          errors: err
        });
      }
      if (!sistema){
        return res.status(400).json({
          ok: false,
          mensaje: 'Error , el sistema con el id'+ id +'no existe',
          errors: {message: 'No existe un sistema con ese id'}
        });
      }
      sistema.apodo = body.apodo;
      sistema.modelo = body.modelo;
      sistema.save((err, sistemaGuardado)=>{
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error al actualizar sistema',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          sistema: sistemaGuardado
        });
      });
    });
  });

// =====================================================
// Crear un nuevo sistema
// =====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
    var body = req.body;
    var sistema = new Sistema({
      numserie: body.numserie,
      usuario: req.usuario._id,
      apodo: body.apodo,
      modelo: body.modelo
    });
    sistema.save((err, sistemaGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al crear sistema',
          errors: err
        });
      }
      res.status(201).json({
        ok: true,
        sistema: sistemaGuardado
      });
    });
  });

// =====================================================
// Borrar sistema por id
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Sistema.findByIdAndRemove(id, (err, sistemaBorrado)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al borrar Sistema',
          errors: err
        });
      }
      if (!sistemaBorrado) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existe un Sistema con ese id',
          errors: {message: 'No existe un Sistema con ese id'}
        });
      }
      res.status(200).json({
        ok: true,
        sistema: sistemaBorrado
      });
    });
  });

  module.exports = app;