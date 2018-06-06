var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var historiaSchema = new Schema({
  date: {type: Date, required: true, default:  Date.now() },
  sistema: {type: Schema.Types.String,ref:'Sistema',required:[true, 'El id del Sistema es un campo obligatorio']},
  Mov1: {type: Boolean, required: true, default: 0},
  Mov2: {type: Boolean, required: true, default: 0},
  Imp1: {type: Boolean, required: true, default: 0},
  Imp2: {type: Boolean, required: true, default: 0},
  Imp3: {type: Boolean, required: true, default: 0},
  Imp4: {type: Boolean, required: true, default: 0},
  Imp5: {type: Boolean, required: true, default: 0},
  Lat: {type: String, required: true, default: '00.00000'},
  Lon: {type: String, required: true, default: '000.0000'}
});

module.exports = mongoose.model('Historia', historiaSchema); 