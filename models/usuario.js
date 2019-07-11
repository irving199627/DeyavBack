var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nickname: { type: String, unique: true },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    img: { type: String, required: false },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    trabajoActual: { type: String, required: false },
    nombre: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('usuario', usuarioSchema);