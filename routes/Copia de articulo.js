var express = require('express');

var app = express();
var fileupload = require('express-fileupload');
var fs = require('fs');

var Articulo = require('../models/articulo');
app.use(fileupload());

// rutas
app.get('/:tipo', (req, res) => {
    var tipo = req.params.tipo;

    if (tipo === 'blog') {
        return getArticulos(res, tipo);
    }
    if (tipo === 'noticia') {
        return getArticulos(res, tipo);
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });
    }
});
app.get('/ultimo/:tipo', (req, res) => {
    var tipo = req.params.tipo;

    if (tipo === 'blog') {
        return getArticulosUltimo(res, tipo);
    }
    if (tipo === 'noticia') {
        return getArticulosUltimo(res, tipo);
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });
    }
});

app.get('/:tipo/:id', (req, res) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    if (tipo === 'blog') {
        return getArticulosById(res, tipo, id);
    }
    if (tipo === 'noticia') {
        return getArticulosById(res, tipo, id);
    }
});

app.post('/:tipo', (req, res, next) => {
    var tipo = req.params.tipo;
    var body = req.body;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            err: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    console.log(archivo);

    if (archivo.size > 2000000) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El peso de la imagen es mayor a 2MB',
            err: { message: 'La imagen debe tener un tamaño menor a 2MB' }
        });
    }

    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            err: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    var nombreArchivo = `${ body.titulo }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                err: err
            });
        }
        if (tipo === 'blog') {
            return crearArticulo(res, body, tipo, nombreArchivo);
        }
        if (tipo === 'noticia') {
            return crearArticulo(res, body, tipo);
        } else {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Tipo no valido'
                }
            });
        }
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })

});


app.put('/:tipo/:id', (req, res) => {
    var id = req.params.id;
    var tipo = req.params.tipo;
    var body = req.body;

    if (tipo === 'blog') {
        return actualizarArticulo(id, res, body);
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

app.delete('/:tipo/:id', (req, res) => {
    var id = req.params.id;
    var tipo = req.params.tipo;

    if (tipo === 'blog') {
        return eliminarArticulo(id, res);
    }
    if (tipo === 'noticia') {
        return eliminarArticulo(id, res);
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });
    }

})

// Funciones 
function eliminarArticulo(id, res) {
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

}

function actualizarArticulo(id, res, body) {
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

        articulo.titulo = body.titulo;
        articulo.img = body.img;
        articulo.contenido = body.contenido;

        articulo.save((err, articuloGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar articulo',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                articulo: articuloGuardado
            });
        });
    });

}

function getArticulos(res, tipo) {
    Articulo.find({ tipo, activo: true })
        .sort({$natural:-1})
        .exec((err, articulosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Articulo.countDocuments({ tipo }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    articulos: articulosDB,
                    total: conteo
                });
            });
        });
}

function getArticulosUltimo(res, tipo) {
    Articulo.find({ tipo, activo: true })
        .sort({ $natural: -1 })
        .limit(1)
        .exec((err, articulosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Articulo.countDocuments({ tipo }, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    articulos: articulosDB,
                    total: conteo
                });
            });
        });
}

function getArticulosById(res, tipo, id) {
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
        articuloBD.update({ $inc: { contador: 1 } }, (err) => {
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
}

function crearArticulo(res, body, tipo, nombreArchivo)  {
    var articulo = new Articulo({
        titulo: body.titulo,
        contenido: body.contenido,
        img: nombreArchivo,
        tipo: tipo
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
}

module.exports = app;