/**
 * Controller de gerenciamento de arestas direcionadas entre usuários
 */

exports.getArestas = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM ArestaUsuario', function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

// post com origem e destino (em ordem) para criar nova aresta
exports.postAresta = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        var data = {
            origem: req.params.origem,
            destino: req.params.destino
        };

        connection.query('INSERT INTO ArestaUsuario SET ?', [data], function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json({ message: 'Aresta criada com sucesso!' });
        });
    });
};

// delete com origem e destino (em ordem) para excluir a aresta, caso exista
exports.deleteAresta = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('DELETE FROM ArestaUsuario WHERE origem = ? AND destino = ?', [req.params.origem, req.params.destino], function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};
