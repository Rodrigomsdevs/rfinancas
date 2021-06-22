const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./autologin');
const usuario = require('./usuario.controller');

function hasLogado(req) {
    return req.session && req.session.conta;
}

function setSession(req, result) {

    req.session.conta = {
        'id': result.id,
        'nome': result.nome,
        'sobrenome': result.sobrenome,
        'nome_completo': `${result.nome} ${result.sobrenome}`,
        'email': result.email,
        'data_cadastro': result.data_cadastro
    };

    
}

module.exports = {
    hasLogado,
    setSession
}