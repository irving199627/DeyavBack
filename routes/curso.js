var express = require('express');

var mdautenticacion = require('../middlewares/autenticacion');

var app = express();

var Curso = require('../models/curso');


// rutas
/*  ======================================
        Obtener todos los cursos
    ====================================== */
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Curso.find({})
        .skip(desde)
        .limit(5)
        .exec((err, cursos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando cursos',
                    errors: err
                });
            }

            Curso.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    cursos: cursos,
                    totalConteo: conteo
                });
            });
        });
});

/*  ======================================
        ACTUALIZAR un curso
    ====================================== */
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Curso.findById(id, (err, curso) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar curso',
                errors: err
            });
        }

        if (!curso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El curso con el id ' + id + ' no existe',
                errors: { message: 'No existe un curso con ese ID' }
            });
        }

        curso.nombre = body.nombre;
        curso.descripcion = body.descripcion;
        curso.categoria = body.categoria;
        curso.temario = body.temario;
        curso.objetivo = body.objetivo;

        curso.save((err, cursoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar curso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                curso: cursoGuardado
            });
        });
    });
});

/*  ======================================
        Crear un nuevo curso
    ====================================== */
app.post('/', (req, res) => {
    var body = req.body;
    var curso = new Curso({
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        temario: body.temario,
        objetivo: body.objetivo
    });

    curso.save((err, cursoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear curso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            curso: cursoGuardado
        });
    })
});

/*  ======================================
        ELIMINAR un curso por el id
    ====================================== */
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Curso.findByIdAndRemove(id, (err, cursoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar curso',
                errors: err
            });
        }
        if (!cursoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un curso con ese ID',
                errors: { message: 'No existe un curso con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            curso: cursoBorrado
        });
    });
});
module.exports = app;