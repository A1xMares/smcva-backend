var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var sistemaSchema = new Schema({
  numserie: {type: String, unique: true, required: [true, 'El número de serie es necesario']},
  usuario: {type: Schema.Types.ObjectId,ref:'Usuario',required:[true, 'El id del Usuario es un campo obligatorio']},
  apodo: {type: String,  required: [true, 'El apodo es necesario']},
  modelo: {type: String,  required: false},
  img: {type: String, required: false},
});

sistemaSchema.plugin(uniqueValidator, { message: 'El número de serie debe ser único' });
module.exports = mongoose.model('Sistema', sistemaSchema); 
