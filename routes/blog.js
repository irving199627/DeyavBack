var express = require('express');

var app = express();
var fileupload = require('express-fileupload');
var fs = require('fs');

var Articulo = require('../models/articulo');
app.use(fileupload());

// rutas
app.get('/', (req, res) => {
    Articulo.find({ tipo: 'blog', activo: true })
        .sort({ $natural: -1 })
        .exec((err, articulosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Articulo.countDocuments({ tipo: 'blog' }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    articulos: articulosDB,
                    total: conteo
                });
            });
        });
});

app.get('/ultimo', (req, res) => {
    Articulo.find({ tipo: 'blog', activo: true })
        .sort({ $natural: -1 })
        .limit(1)
        .exec((err, articulosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Articulo.countDocuments({ tipo: 'blog' }, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    articulos: articulosDB,
                    total: conteo
                });
            });
        });
});

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Articulo.findById(id, (err, articuloBD) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!articuloBD) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'No existe un articulo con ese id'
                }
            })
        }
        // talvez
        articuloBD.updateOne({ $inc: { contador: 1 } }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                articuloBD
            });
        })
    });
});

app.post('/:tipo', (req, res, next) => {
    var tipo = req.params.tipo;
    var body = req.body;
    var imagen64 = body.img;
    var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');

    var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
    fs.writeFile(`./uploads/${ tipo }/${nombreArchivo}`, binaryData, 'binary', err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        var articulo = new Articulo({
            titulo: body.titulo,
            contenido: body.contenido,
            img: nombreArchivo,
            autor: body.autor,
            tipo: 'blog'
        });

        articulo.save((err, articuloGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear articulo',
                    err
                });
            }

            res.status(201).json({
                ok: true,
                articulo: articuloGuardado
            });
        });


    });
});


app.put('/:id', (req, res) => {
    var id = req.params.id;
    var tipo = req.params.tipo;
    var body = req.body;
    var imagen64 = body.img;
    if (imagen64 !== undefined) {
        var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
        var pathViejo = './uploads/' + tipo + '/' + body.nombreImagen;
        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, (err) => {
                console.log('borrado');
            });
        }
        var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
        return fs.writeFile(`./uploads/${ tipo }/${nombreArchivo}`, binaryData, 'binary', err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (tipo === 'blog') {
                return actualizarArticulo(id, res, body, nombreArchivo);
            }
            if (tipo === 'noticia') {
                return actualizarArticulo(id, res, body);
            } else {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Tipo no valido'
                    }
                });
            }
        });
    }
    if (tipo === 'blog') {
        return actualizarArticulo(id, res, body, '');
    }
    if (tipo === 'noticia') {
        return actualizarArticulo(id, res, body);
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });
    }


});



app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Articulo.findById(id, (err, articulo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un artículo con ese id',
                errors: err
            });
        }
        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo con el id ' + id + ' no existe',
                errors: { message: 'No existe un articulo con ese ID' }
            });
        }

        articulo.activo = false;

        articulo.save((err, articuloGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al eliminar articulo',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                articulo: articuloGuardado
            });
        });
    });


})
module.exports = app;