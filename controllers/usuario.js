var bcrypt = require('bcrypt-nodejs');

// Lista todos os usuarios
exports.getUsuarios = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Usuario', function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

// Cria um novo usuario
exports.postUsuarios = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        var data = req.body;

        // aplica o hash na senha
        bcrypt.genSalt(5, function(err, salt) {
            if (err)
                res.status(400).send(err);

            bcrypt.hash(data.password, salt, null, function(err, hash) {
                if (err)
                    res.status(400).send(err);

                data.password = hash;

                connection.query('INSERT INTO Usuario SET ? ', data, function(err, rows) {
                    if (err)
                        res.status(400).send(err);

                    res.json({'message': 'Usuário adicionado com sucesso!'});
                });
            });
        });
    });
};

exports.getUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Usuario WHERE id = ?', [req.params.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            if (rows.length != 1)
                res.status(404)

            res.json(rows[0]);
        });
    });
};

// Altera um usuario
exports.putUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        var data = req.body;

        // aplica o hash na senha se necessário
        bcrypt.genSalt(5, function(err, salt) {
            if (err)
                res.status(400).send(err);

            if (data.password) {
                bcrypt.hash(data.password, salt, null, function(err, hash) {
                    if (err)
                        res.status(400).send(err);

                    data.password = hash;

                    connection.query('UPDATE Usuario SET ? WHERE id = ?', [data, req.params.id], function(err, rows) {
                        if (err)
                            res.status(400).send(err);

                        res.json(rows);
                    });
                });
            } else {
                connection.query('UPDATE Usuario SET ? WHERE id = ?', [data, req.params.id], function(err, rows) {
                    if (err)
                        res.status(400).send(err);

                    res.json(rows);
                });
            }
        });
    });
};

// Deleta o usuario
exports.deleteUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.beginTransaction(function(err) {
            if (err)
                res.status(400).send(err);

            connection.query('DELETE FROM Usuario WHERE id = ?', [req.params.id], function(err, rows) {
                if (err) {
                    connection.rollback(function() {
                        res.status(400).send(err);
                    });
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            res.status(400).send(err);
                        });
                    }

                    res.json({ message: 'Usuário excluído com sucesso!' });
                });
            });
        });
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
