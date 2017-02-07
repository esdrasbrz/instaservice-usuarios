var Usuario = require('../models/usuario');


// Cria um novo usuario
exports.postUsuarios = function(req, res) {
    var usuario = new Usuario(req.body);

    usuario.save(function(err) {
        if (err)
            res.send(err)

        res.json({ message: "Usuário adicionado com sucesso!" });
    });
};

// Lista todos os usuarios
exports.getUsuarios = function(req, res) {
    Usuario.find(function(err, usuarios) {
        if (err)
            res.send(err);

        res.json(usuarios);
    });
};
