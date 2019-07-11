var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({

    titulo: { type: String, required: [true, 'El titulo	es necesario'] },
    contenido: { type: String, required: [true, 'El contenido es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
    contador: { type: Number, required: false }

}, { collection: 'blogs' });

module.exports = mongoose.model('Blog', blogSchema);