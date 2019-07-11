var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var materialSchema = new Schema({

    // fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    curso: { type: Schema.Types.ObjectId, ref: 'Curso' },
    material: { type: String, required: [true, 'El material es necesario'] }

}, { collection: 'materiales' });

module.exports = mongoose.model('Material', materialSchema);