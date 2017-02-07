// Get the packages we need
var express = require('express');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');

var usuarioController = require('./controllers/usuario');
var arestaController = require('./controllers/aresta');

var config = require('./config.json');

// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

/** MYSQL **/

app.use(
    connection(mysql, {
        host: config.bd.host,
        port: config.bd.port,
        user: config.bd.user,
        password: config.bd.password,
        database: config.bd.database
    }, 'request')
);

/** ROUTES **/

// Create our express router
var router = express.Router();

router.route('/usuarios')
    .post(usuarioController.postUsuarios)
    .get(usuarioController.getUsuarios);

router.route('/usuarios/:id')
    .get(usuarioController.getUsuario)
    .put(usuarioController.putUsuario)
    .delete(usuarioController.deleteUsuario);

router.route('/usuarios/:id/seguindo')
    .get(usuarioController.getSeguindo);

router.route('/usuarios/:id/seguidores')
    .get(usuarioController.getSeguidores);

router.route('/usuarios/check')
    .post(usuarioController.checkUsuario);


router.route('/arestas')
    .get(arestaController.getArestas);

router.route('/arestas/:origem/:destino/')
    .post(arestaController.postAresta)
    .delete(arestaController.deleteAresta);

// Register all our router with /api
app.use('/api', router);

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;

// Start the server
app.listen(port);
console.log('Listening: ' + port);
