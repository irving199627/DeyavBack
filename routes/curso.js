var express = require('express');

var mdautenticacion = require('../middlewares/autenticacion');

var app = express();

var Curso = require('../models/curso');
var fs = require('fs');

// rutas
/*  ======================================
        Obtener todos los cursos
    ====================================== */
app.get('/', (req, res, next) => {
    Curso.find({ activo: true })
        .exec((err, cursos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando cursos',
                    errors: err
                });
            }

            Curso.countDocuments({ activo: true }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    cursos: cursos,
                    totalConteo: conteo
                });
            });
        });
});

app.get('/:categoria', (req, res, next) => {
    var categoria = req.params.categoria;
    Curso.find({ categoria: categoria, activo: true })
        .exec((err, cursos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando cursos',
                    errors: err
                });
            }

            Curso.countDocuments({ categoria, activo: true }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    cursos: cursos,
                    totalConteo: conteo
                });
            });
        });
});

app.get('/1/:id', (req, res, next) => {
    var id = req.params.id;
    Curso.findById(id, (err, curso) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando curso',
                errors: err
            });
        }
        if (!curso) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'No existe un curso con ese id'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            curso: curso
        });
    });
});

/*  ======================================
        ACTUALIZAR un curso
    ====================================== */
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var imagen64 = body.img;

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

        curso.titulo = body.titulo;
        curso.descripcion = body.descripcion;
        curso.categoria = body.categoria;
        curso.precio = body.precio;
        if (imagen64 !== undefined) {
            var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
            var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
            var pathViejo = './uploads/cursos/' + body.nombreImagen;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('borrado');
                });
            }
            return fs.writeFile(`./uploads/cursos/${nombreArchivo}`, binaryData, 'binary', err => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                curso.img = nombreArchivo;
                curso.save((err, cursoGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar curso',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        curso: cursoGuardado
                    });
                });
            });
        }

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
    var imagen64 = body.imagen;

    if (imagen64 !== undefined) {
        var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
        var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
        return fs.writeFile(`./uploads/cursos/${nombreArchivo}`, binaryData, 'binary', err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            var curso = new Curso({
                imagen: nombreArchivo,
                titulo: body.titulo,
                descripcion: body.descripcion,
                categoria: body.categoria,
                precio: body.precio
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
            });
        })
    }
});

/*  ======================================
        ELIMINAR un curso por el id
    ====================================== */
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Curso.findById(id, (err, curso) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un curso con ese id',
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
        curso.activo = false;
        curso.save((err, cursoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al eliminar curso',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                curso: cursoGuardado
            });
        })
    });
});
module.exports = app;