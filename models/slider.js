var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sliderSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false }, //[true, 'La imagen es necesaria'] },
    url: { type: String, require: [true, 'El URL es necesario'] },
    versiculo: { type: String, require: [true, 'El versiculo es necesario'] }

});

module.exports = mongoose.model('slider', sliderSchema);