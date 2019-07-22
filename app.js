// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
// const path = require('path');
// const http = require('http');

// Inicializar variables
var app = express();
// const publicPath = path.resolve(__dirname, '/public');
// let server = http.createServer(app);
const port = 3000;

// app.use(express.static(publicPath));

// CORS
app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Content-type,' +
//         'Authorization, Content-Length,X-Requested-With,Access-Control-Request-Headers,token');
//     next();
// });


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));

// Importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
// var articuloRoutes = require('./routes/articulo');
var blogRoutes = require('./routes/blog');

var cursosRoutes = require('./routes/curso');
var inscripcionRoutes = require('./routes/inscripcion');
var sliderRoutes = require('./routes/slider');

// var busquedaRoutes = require('./routes/busqueda');
// var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes')
    // Conexion a la BD
    // mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

//     if (err) throw err;
//     console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online')
// })
mongoose.set('useCreateIndex', true);
mongoose.connection.openUri('mongodb://localhost:27017/DeyavDB', { useNewUrlParser: true })


// server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
// app.use('/hospital', hospitalRoutes);
app.use('/api/v1/usuario', usuariosRoutes);
app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/curso', cursosRoutes);
app.use('/api/v1/inscripcion', inscripcionRoutes);
app.use('/api/v1/slider', sliderRoutes);
// app.use('/api/v1/articulo', articuloRoutes);
app.use('/api/v1/blog', blogRoutes);

// app.use('/busqueda', busquedaRoutes);
// app.use('/upload', uploadRoutes);
app.use('/api/v1/img', imagenesRoutes);
app.use('/api/v1', appRoutes);


// Escuchar petiosiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
module.exports = app;
// server.listen(port, (err) => {

//     if (err) throw new Error(err);

//     console.log(`Servidor corriendo en puerto ${ port }`);

// });