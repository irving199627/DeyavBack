var express = require('express');

var mdautenticacion = require('../middlewares/autenticacion');

var app = express();

var Inscripcion = require('../models/inscripcion');
// rutas

/*  ======================================
        Obtener todos las inscripciones
    ====================================== */
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Inscripcion.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('curso')
        .exec((err, inscripciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando inscripciones',
                    errors: err
                });
            }

            Inscripcion.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    inscripciones: inscripciones,
                    totalConteo: conteo
                });
            });
        });
});

/*  ======================================
        Crear una nueva inscripcion
    ====================================== */

app.post('/', mdautenticacion.veficaToken, (req, res) => {
    var body = req.body;
    var inscripcion = new Inscripcion({
        usuario: req.usuario._id,
        curso: body.curso
    });

    inscripcion.save((err, inscripcionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al inscribirse al cruso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            inscripcion: inscripcionGuardada
        });
    })
})
module.exports = app;