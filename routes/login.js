var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//====================================
// Autenticacion google
// ===================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  } 
}

app.post('/google', async(req, res) =>{
  var token = req.body.token;
  var googleUser = await verify( token )
    .catch(e => {
      return res.status(403).json({
        ok: true,
        mensaje: 'Token no válido'
      });
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
      if (err){
        res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar el usuario',
          errors: err
        });
      }
      if (usuarioDB){
        if (usuarioDB.google === false){
          res.status(400).json({
            ok: false,
            mensaje: 'Debe usar su autenticación normal',
          });
        } else {
        // El usuario  existe, hay que crear su token
          var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 900}); //Expira en 15 minutos
          
          res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
          });
        }
      } else {
        // El usuario no existe, hay que crearlo
        var usuario = new Usuario();
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = '*';

        usuario.save ((err, usuarioDB) => {
          var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 900}); //Expira en 15 minutos
          
          res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
          });
        });
      }
    });
});

//====================================
// Autenticacion normal
// ===================================
app.post('/', (req, res)=>{
    var body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscar usuario',
              errors: err
            });
          }
          if (!usuarioDB){
            return res.status(400).json({
              ok: false,
              mensaje: 'Credenciales incorrectas',
              errors: err
            });
          }
          if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
              ok: false,
              mensaje: 'Credenciales incorrectas',
              errors: err
            });
          }
          //Crear un token
          usuarioDB.password = '::encriptado::';
          var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 3600}); //Expira en 60 minutos

          res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
          });
    });
});

module.exports = app;