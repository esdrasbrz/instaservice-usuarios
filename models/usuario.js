var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Definindo o schema usuario
var UsuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nome: String,
    bio: String
});

// Encripta a senha em pre-save
UsuarioSchema.pre('save', function(callback) {
    var usuario = this;

    // verifica se a senha foi modificada
    if (!usuario.isModified('password')) return callback();

    // aplica o hash na senha
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(usuario.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            usuario.password = hash;
            callback();
        });
    });
});

UsuarioSchema.methods.checkPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



module.exports = mongoose.model('Usuario', UsuarioSchema);
