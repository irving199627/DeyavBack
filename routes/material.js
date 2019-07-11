var express = require('express');

var app = express();

var mdautenticacion = require('../middlewares/autenticacion');

var Material = require('../models/material');
// rutas
/*  ======================================
        Obtener un solo material por ID
    ====================================== */
app.get('/:idCurso', (req, res, next) => {
    var idCurso = req.params.idCurso;

    Material.findOne({ 'curso': idCurso })
        .populate('curso')
        .exec((err, material) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar material',
                    errors: err
                });
            }

            if (!material) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El material con el id ' + idCurso + ' no existe',
                    errors: { message: 'No existe un material con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                material: material
            });
        })
});

/*  ======================================
        Actualizar un nuevo material
    ====================================== */
app.put('/:id', mdautenticacion.veficaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Material.findById(id, (err, material) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar material',
                errors: err
            });
        }

        if (!material) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El material con el id ' + id + ' no existe',
                errors: { message: 'No existe un material con ese ID' }
            });
        }

        material.material = body.material;

        material.save((err, materialGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                material: materialGuardado
            });
        })
    })
})

/*  ======================================
        Crear un nuevo material
    ====================================== */
app.post('/', mdautenticacion.veficaToken, (req, res) => {
    var body = req.body;
    var material = new Material({
        material: body.material,
        curso: body.curso
    });

    material.save((err, materialGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear material',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            material: materialGuardado
        });
    });
});

/*  ======================================
        ELIMINAR un material por el id
    ====================================== */
app.delete('/:id', mdautenticacion.veficaToken, (req, res) => {
    var id = req.params.id;

    Material.findByIdAndRemove(id, (err, materialBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar material',
                errors: err
            });
        }

        if (!materialBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un material con ese ID',
                errors: { message: 'No existe un material con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            material: materialBorrado
        });
    })
});

module.exports = app;