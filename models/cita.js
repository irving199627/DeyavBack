var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citaSchema = new Schema({

    // fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    fecha: { type: String, required: [true, 'La fecha es necesaria'] },
    horaInicio: { type: String, required: [true, 'La hora de inicio es necesaria'] },
    horaFin: { type: String, required: [true, 'La hora de finalización es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }

}, { collection: 'citas' });

module.exports = mongoose.model('Cita', citaSchema);