// Get the packages we need
var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var usuarioController = require('./controllers/usuario');
var arestaController = require('./controllers/aresta');

var passport = require('passport')
var authController = require('./controllers/auth');

var config = require('./config.json');

// Create our Express application
var app = express();

app.use(bodyParser.json());


app.use(cors());

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

// Passport para autenticação
app.use(passport.initialize());

/** ROUTES **/

// Create our express router
var router = express.Router();

router.route('/usuarios')
    .post(usuarioController.postUsuarios)
    .get(authController.isAuthenticated, usuarioController.getUsuarios);

router.route('/usuarios/:username/search/:tam_pag/:pag')
    .get(authController.isAuthenticated, usuarioController.searchUsuario);

router.route('/usuarios/:id')
    .get(authController.isAuthenticated, usuarioController.getUsuario)
    .put(authController.isAuthenticated, usuarioController.putUsuario)
    .delete(authController.isAuthenticated, usuarioController.deleteUsuario);

router.route('/usuarios/:id/seguindo/:tam_pag/:pag')
    .get(authController.isAuthenticated, usuarioController.getSeguindo);

router.route('/usuarios/:id/seguindo/count')
    .get(authController.isAuthenticated, usuarioController.getCountSeguindo);

router.route('/usuarios/:id/seguindo/')
    .get(authController.isAuthenticated, usuarioController.getSeguindoAll);


router.route('/usuarios/:id/seguidores')
    .get(authController.isAuthenticated, usuarioController.getSeguidores);

router.route('/usuarios/check')
    .post(usuarioController.checkUsuario);


router.route('/arestas')
    .get(authController.isAuthenticated, arestaController.getArestas);

router.route('/arestas/:origem/:destino/')
    .post(authController.isAuthenticated, arestaController.postAresta)
    .delete(authController.isAuthenticated, arestaController.deleteAresta);

// Register all our router with /api
app.use('/api', router);

/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;
var ip = config.server.ip;

// Start the server
app.listen(port, ip);
/*https.createServer({
    key: fs.readFileSync('certificate/key.pem'),
    cert: fs.readFileSync('certificate/cert.pem'),
}, app).listen(port);*/

console.log('Listening: ' + ip + ":" + port);
