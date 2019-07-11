var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cursoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    objetivo: { type: String, required: [true, 'El objetivo es necesario'] },
    temario: { type: String, required: [true, 'El temario es necesario'] },
    videos: { type: Schema.Types.ObjectId, ref: 'Video' }

}, { collection: 'cursos' });

module.exports = mongoose.model('Curso', cursoSchema);