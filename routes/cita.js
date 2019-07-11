var express = require('express');

var mdautenticacion = require('../middlewares/autenticacion');

var app = express();

var Cita = require('../models/cita');

// rutas

/*  ======================================
        Obtener todos las citas
    ====================================== */
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cita.find({})
        .skip(desde)
        .limit(5)
        .exec((err, citas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando citas',
                    errors: err
                });
            }
            Cita.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    citas: citas,
                    totalConteo: conteo
                });
            });
        });
});



module.exports = app;