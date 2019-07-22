var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({

    titulo: { type: String, required: [true, 'El titulo	es necesario'] },
    autor: { type: String, required: [true, 'El autor es necesario'] },
    contenido: { type: String, required: [true, 'El contenido es necesario'] },
    img: { type: String, required: false },
    activo: { type: Boolean, required: false, default: true },
    contador: { type: Number, required: false, default: 0 }

}, { collection: 'blogs' });

module.exports = mongoose.model('Blog', blogSchema);