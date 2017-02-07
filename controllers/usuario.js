var Usuario = require('../models/usuario');


// Cria um novo usuario
exports.postUsuarios = function(req, res) {
    var usuario = new Usuario(req.body);

    usuario.save(function(err) {
        if (err)
            res.status(400).send(err)

        res.json({ message: "Usuário adicionado com sucesso!" });
    });
};

// Lista todos os usuarios
exports.getUsuarios = function(req, res) {
    Usuario.find(function(err, usuarios) {
        if (err)
            res.status(400).send(err);

        res.json(usuarios);
    });
};

exports.getUsuario = function(req, res) {
    Usuario.findById(req.params.id, function(err, usuario) {
        if (err)
            res.status(400).send(err);

        res.json(usuario);
    });
};

// Altera um usuario
exports.putUsuario = function(req, res) {
    // Procura o usuario específico
    Usuario.findById(req.params.id, function(err, usuario) {
        if (err)
            res.status(400).send(err);

        usuario.set(req.body);
        usuario.save(function(err) {
            if (err)
                res.status(400).send(err);

            res.json(usuario);
        });
    });
};

// Deleta o usuario
exports.deleteUsuario = function(req, res) {
    Usuario.findByIdAndRemove(req.params.id, req.body, function(err, usuario) {
        if (err)
            res.status(400).send(err);

        res.json(usuario);
    });
};

// funcao para checar o login do usuario, recebendo em POST parametros username e password
exports.checkUsuario = function(req, res) {
    Usuario.findOne({ username: req.body.username }, function (err, usuario) {
        if (err)
            res.status(400).send(err);

        // verifica se encontrou o usuario
        if (usuario) {
            usuario.checkPassword(req.body.password, function(err, isMatch) {
                if (err)
                    res.status(400).send(err);

                if (isMatch) {
                    res.json({auth: true, usuario: usuario});
                } else {
                    res.json({auth: false});
                }
            });
        } else {
            res.json({auth: false});
        }
    });
};
