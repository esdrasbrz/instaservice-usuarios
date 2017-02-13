/**
 * Controller de gerenciamento de usuários
 */

var bcrypt = require('bcrypt-nodejs');

// Lista todos os usuarios
exports.getUsuarios = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT id, username, nome, bio FROM Usuario', function(err, rows) {
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

        connection.query('SELECT id, username, nome, bio FROM Usuario WHERE id = ?', [req.params.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            if (rows.length != 1)
                res.status(404)

            var usuario = rows[0];
            res.json(usuario);
        });
    });
};

// Altera um usuario
exports.putUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        var data = req.body;

        // verifica se o usuario não pode alterar
        if (req.params.id != req.user.id)
            res.status(401).send();

        // aplica o hash na senha se necessário
        bcrypt.genSalt(5, function(err, salt) {
            if (err)
                res.status(400).send(err);

            if (data.password) {
                bcrypt.hash(data.password, salt, null, function(err, hash) {
                    if (err)
                        res.status(400).send(err);

                    data.password = hash;

                    connection.query('UPDATE Usuario SET ? WHERE id = ? and id = ?', [data, req.params.id, req.user.id], function(err, rows) {
                        if (err)
                            res.status(400).send(err);

                        res.json(rows);
                    });
                });
            } else {
                connection.query('UPDATE Usuario SET ? WHERE id = ? and id = ?', [data, req.params.id, req.user.id], function(err, rows) {
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

        // verifica se o usuario não pode excluir
        if (req.params.id != req.user.id)
            res.status(401).send();

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

                    res.json(rows);
                });
            });
        });
    });
};

// funcao para checar o login do usuario, recebendo em POST parametros username e password
exports.checkUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Usuario WHERE username = ?', [req.body.username], function(err, rows) {
            if (err)
                res.status(400).send(err);

            if (rows.length != 1) {
                res.json({ auth: false });
            } else {
                // checa a senha
                usuario = rows[0];
                bcrypt.compare(req.body.password, usuario.password, function(err, isMatch) {
                    if (err)
                        res.status(400).send(err);

                    if (isMatch) {
                        delete usuario['password'];
                        res.json({ auth: true, usuario: usuario });
                    } else {
                        res.json({ auth: false });
                    }
                })
            }
        });
    });
};

exports.searchUsuario = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT id, username, nome, bio FROM Usuario WHERE username like "%' + req.params.username + '%"', function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

// retorna todos os usuários que são seguidos
exports.getSeguindo = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT u.id, u.username, u.nome, u.bio FROM Usuario u, ArestaUsuario a ' +
            'WHERE a.origem = ? and u.id = a.destino', [req.params.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

// retorna todos os seguidores
exports.getSeguidores = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT u.id, u.username, u.nome, u.bio FROM Usuario u, ArestaUsuario a ' +
            'WHERE a.destino = ? and u.id = a.origem', [req.params.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};
