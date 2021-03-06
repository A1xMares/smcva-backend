var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
  values: ['ADMIN_ROLE', 'TRABAJADOR_ROLE', 'USUARIO_ROLE'],
  message: '{VALUE} no es un rol válido'
};

var usuarioSchema = new Schema({
  nombre: {type: String, required: [true, 'El nombre es necesario']},
  email: {type: String, unique: true, required: [true, 'El {PATH} es necesario']},
  password: {type: String, required: [true, 'La contraseña es necesaria']},
  img: {type: String, required: false},
  role: {type: String, required: true, default: 'USUARIO_ROLE', enum: rolesValidos},
  google: {type: Boolean, default: false}
});

usuarioSchema.plugin(uniqueValidator, { message: 'El correo debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema); 