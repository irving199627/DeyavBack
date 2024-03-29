// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// Inicializar variables
var app = express();

const port = 3000;



// CORS
app.use(cors());

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));

// Importar rutas
var appRoutes = require('./routes/app');
var blogRoutes = require('./routes/blog');
var cursosRoutes = require('./routes/curso');
var emailRoutes = require('./routes/email');
var imagenesRoutes = require('./routes/imagenes')
var inscripcionRoutes = require('./routes/inscripcion');
var loginRoutes = require('./routes/login');
var noticiaRoutes = require('./routes/noticia');
var sliderRoutes = require('./routes/slider');
var usuariosRoutes = require('./routes/usuario');
// Conexion a la BD
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection.openUri('mongodb://localhost:27017/DeyavDB', { useNewUrlParser: true })

// Rutas
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/curso', cursosRoutes);
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/img', imagenesRoutes);
app.use('/api/v1/inscripcion', inscripcionRoutes);
app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/noticia', noticiaRoutes);
app.use('/api/v1/slider', sliderRoutes);
app.use('/api/v1/usuario', usuariosRoutes);
app.use('/api/v1', appRoutes);


// Escuchar petiosiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
module.exports = app;