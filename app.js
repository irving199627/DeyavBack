// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST', 'GET', 'PUT', 'DELETE', 'OPTIONS');
    next();
});


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var cursosRoutes = require('./routes/curso');
var blogRoutes = require('./routes/blog');
var citasRoutes = require('./routes/cita');
var inscripcionRoutes = require('./routes/inscripcion');
var materialesRoutes = require('./routes/material');
var sliderRoutes = require('./routes/slider');
// var busquedaRoutes = require('./routes/busqueda');
// var uploadRoutes = require('./routes/upload');
// var imagenesRoutes = require('./routes/imagenes')
// Conexion a la BD
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

//     if (err) throw err;
//     console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online')
// })

mongoose.connection.openUri('mongodb://localhost:27017/DeyavDB', { useNewUrlParser: true })


// server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
// app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuariosRoutes);
// app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/curso', cursosRoutes);
app.use('/blog', blogRoutes);
app.use('/cita', citasRoutes);
app.use('/inscripcion', inscripcionRoutes);
app.use('/material', materialesRoutes);
app.use('/slider', sliderRoutes);
// app.use('/busqueda', busquedaRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar petiosiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
module.exports = app;