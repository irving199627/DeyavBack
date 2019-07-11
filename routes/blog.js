var express = require('express');

var app = express();

var mdautenticacion = require('../middlewares/autenticacion');
var Blog = require('../models/blog');

// rutas
/*  ======================================
        Obtener todos los blogs
    ====================================== */
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Blog.find({})
        .skip(desde)
        .limit(5)
        .exec((err, blogs) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando blog',
                    errors: err
                });
            }

            Blog.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    blogs: blogs,
                    totalConteo: conteo
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
    })
})

/*  ======================================
        ACTUALIZAR un blog
    ====================================== */
app.put('/:id', mdautenticacion.veficaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Blog.findById(id, (err, blog) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar blog',
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
        blog.img = body.img;

        blog.save((err, blogGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar blog',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                blog: blogGuardado
            });
        });
    });
});

/*  ======================================
        Crear un nuevo blog
    ====================================== */
app.post('/', mdautenticacion.veficaToken, (req, res) => {
    var body = req.body;
    var blog = new Blog({
        titulo: body.titulo,
        contenido: body.contenido,
        img: body.img,
        usuario: req.usuario._id
    });

    blog.save((err, blogGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear blog',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            blog: blogGuardado
        });
    });
});

/*  ======================================
        ELIMINAR un blog por el id
    ====================================== */
app.delete('/:id', mdautenticacion.veficaToken, (req, res) => {
    var id = req.params.id;

    Blog.findByIdAndRemove(id, (err, blogBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar blog',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            blog: blogBorrado
        });
    })
})

module.exports = app;