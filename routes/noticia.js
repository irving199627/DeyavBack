var express = require('express');

var app = express();
var fileupload = require('express-fileupload');
var fs = require('fs');

var Noticia = require('../models/noticia');
app.use(fileupload());

// rutas
app.get('/', (req, res) => {
    Noticia.find({ activo: true })
        .sort({ $natural: -1 })
        .exec((err, noticiaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Noticia.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    noticias: noticiaDB,
                    total: conteo
                });
            });
        });
});

app.get('/1/ultimo', (req, res) => {
    Noticia.find({ activo: true })
        .sort({ $natural: -1 })
        .limit(1)
        .exec((err, noticiaBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            return res.status(200).json({
                ok: true,
                noticias: noticiaBD,
            });

        });
});

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Noticia.findById(id, (err, noticiaBD) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!noticiaBD) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'No existe un noticia con ese id'
                }
            })
        }
        // talvez
        noticiaBD.updateOne({ $inc: { contador: 1 } }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                noticiaBD
            });
        })
    });
});

app.post('/', (req, res, next) => {
    var body = req.body;
    var imagen64 = body.img;

    if (imagen64 !== undefined) {
        var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
        var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
        return fs.writeFile(`./uploads/noticia/${nombreArchivo}`, binaryData, 'binary', err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            var noticia = new Noticia({
                titulo: body.titulo,
                contenido: body.contenido,
                autor: body.autor,
                img: nombreArchivo
            });

            noticia.save((err, noticiaGuardada) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear articulo',
                        err
                    });
                }

                res.status(201).json({
                    ok: true,
                    noticia: noticiaGuardada
                });
            });
        });
    }
});


app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var imagen64 = body.img;

    Noticia.findById(id, (err, noticia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe una noticia con ese id',
                errors: err
            });
        }
        if (!noticia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El noticia con el id ' + id + ' no existe',
                errors: { message: 'No existe un noticia con ese ID' }
            });
        }

        noticia.titulo = body.titulo;
        noticia.contenido = body.contenido;
        noticia.autor = body.autor;
        if (imagen64 !== undefined) {
            var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
            var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
            var pathViejo = './uploads/noticia/' + body.nombreImagen;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('borrado');
                });
            }
            return fs.writeFile(`./uploads/noticia/${nombreArchivo}`, binaryData, 'binary', err => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                noticia.img = nombreArchivo;
                noticia.save((err, noticiaGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar articulo',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        noticia: noticiaGuardado
                    });
                });
            });
        }


        noticia.save((err, noticiaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar articulo',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                noticia: noticiaGuardado
            });
        });
    });


});



app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Noticia.findById(id, (err, noticia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un artículo con ese id',
                errors: err
            });
        }
        if (!noticia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo con el id ' + id + ' no existe',
                errors: { message: 'No existe un articulo con ese ID' }
            });
        }

        noticia.activo = false;

        noticia.save((err, noticiaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al eliminar noticia',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                noticia: noticiaGuardado
            });
        });
    });


})
module.exports = app;