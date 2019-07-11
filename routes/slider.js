var express = require('express');

var app = express();
var Slider = require('../models/slider');

// rutas
app.get('/', (req, res, next) => {

    Slider.find({})
        .exec((err, nav) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                nav
            });
        });
});

app.post('/', (req, res, next) => {
    var body = req.body;
    var slider = new Slider({
        versiculo: body.versiculo,
        nombre: body.nombre,
        img: body.img,
        url: body.url
    });

    slider.save((err, sliderGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear slider',
                err
            });
        }

        return res.status(200).json({
            ok: true,
            sliderGuardado
        });
    })
})

// Implementar las rutas con DELETE, UPDATE

module.exports = app;