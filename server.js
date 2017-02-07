// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var usuarioController = require('./controllers/usuario');

var config = require('./config.json');

// Connect to beerlocker MongoDB
mongoose.connect(config.bd.url);

// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

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

router.route('/usuarios/check')
    .post(usuarioController.checkUsuario);

// Register all our router with /api
app.use('/api', router);


/** SERVER START **/

// Use environment defined port or 3000
var port = config.server.port;

// Start the server
app.listen(port);
console.log('Listening: ' + port);
