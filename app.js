const express = require('express');
const session = require('express-session');
const usuario = require('./server/controller/usuario.controller');
const path = require('path');
var sessionstore = require('sessionstore');
const CookieParser = require('cookie-parser');
const app = express();
const port = 3000;

//definição acesso a caminhos
app.use('/cliente/', express.static(path.join(__dirname, '/', 'cliente')));
app.use('/index/', express.static(path.join(__dirname, '/', 'index')));
app.use('/relatorios/', express.static(path.join(__dirname, '/', 'relatorios')));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(session({
    secret: 'rFinanca',
    resave: true,
    saveUninitialized: true,
    store: sessionstore.createSessionStore()
}));
app.use(express.urlencoded({ extended: true }));
//app.use(requireHTTPS);
app.use(CookieParser("rFinancaCookie"));

//rotas
const rotas = require('./server/rotas');
app.use('/', rotas);
app.get('*', async function (req, res) {
    res.render(process.cwd() + "/cliente/pages/404.ejs");
});


function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

console.log(process.cwd() + "/cliente/");


app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});