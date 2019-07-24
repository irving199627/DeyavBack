var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorias = {
    values: ['PSICOLOGIA', 'DESARROLLO HUMANO'],
    mensaje: '{VALUE} no es una categoría permitida'
}
var cursoSchema = new Schema({

    imagen: { type: String, required: false },
    titulo: { type: String, required: [true, 'El nombre	es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    categoria: { type: String, required: true, enum: categorias },
    precio: { type: Number, required: [true, 'El precio es necesario'] },
    activo: { type: Boolean, required: false, default: true }


}, { collection: 'cursos' });

module.exports = mongoose.model('Curso', cursoSchema);