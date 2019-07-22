var express = require('express');

var app = express();
var fileupload = require('express-fileupload');
var fs = require('fs');

var Blog = require('../models/blog');
app.use(fileupload());

// rutas
app.get('/', (req, res) => {
    Blog.find({ activo: true })
        .sort({ $natural: -1 })
        .exec((err, blogDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Blog.countDocuments({ tipo: 'blog' }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    blogs: blogDB,
                    total: conteo
                });
            });
        });
});

app.get('/ultimo', (req, res) => {
    Blog.find({ activo: true })
        .sort({ $natural: -1 })
        .limit(1)
        .exec((err, blogsBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Blog.countDocuments({ tipo: 'blog' }, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    blogs: blogsBD,
                    total: conteo
                });
            });
        });
});

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Blog.findById(id, (err, blogBD) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!blogBD) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'No existe un blog con ese id'
                }
            })
        }
        // talvez
        blogBD.updateOne({ $inc: { contador: 1 } }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                blogBD
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
        var pathViejo = './uploads/blog/' + body.nombreImagen;
        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, (err) => {
                console.log('borrado');
            });
        }
        return fs.writeFile(`./uploads/blog/${nombreArchivo}`, binaryData, 'binary', err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            var blog = new Blog({
                titulo: body.titulo,
                contenido: body.contenido,
                autor: body.autor,
                img: nombreArchivo
            });

            blog.save((err, blogGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear articulo',
                        err
                    });
                }

                res.status(201).json({
                    ok: true,
                    blog: blogGuardado
                });
            });
        });
    }
});


app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var imagen64 = body.img;

    Blog.findById(id, (err, blog) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un blog con ese id',
                errors: err
            });
        }
        if (!blog) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El blog con el id ' + id + ' no existe',
                errors: { message: 'No existe un blog con ese ID' }
            });
        }

        blog.titulo = body.titulo;
        blog.contenido = body.contenido;
        blog.autor = body.autor;
        if (imagen64 !== undefined) {
            var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.jpg`;
            var binaryData = new Buffer.from(imagen64, 'base64').toString('binary');
            var pathViejo = './uploads/blog/' + body.nombreImagen;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.log('borrado');
                });
            }
            return fs.writeFile(`./uploads/blog/${nombreArchivo}`, binaryData, 'binary', err => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                blog.img = nombreArchivo;
                blog.save((err, blogGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar articulo',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        blog: blogGuardado
                    });
                });
            });
        }


        blog.save((err, blogGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar articulo',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                blog: blogGuardado
            });
        });
    });


});



app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Blog.findById(id, (err, blog) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un artículo con ese id',
                errors: err
            });
        }
        if (!blog) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo con el id ' + id + ' no existe',
                errors: { message: 'No existe un articulo con ese ID' }
            });
        }

        blog.activo = false;

        blog.save((err, blogGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al eliminar blog',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                blog: blogGuardado
            });
        });
    });


})
module.exports = app;