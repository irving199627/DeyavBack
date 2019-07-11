var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inscripcionSchema = new Schema({

    // fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    curso: { type: Schema.Types.ObjectId, ref: 'Curso' },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }

}, { collection: 'inscripciones' });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);