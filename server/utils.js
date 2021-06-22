const mysql = require('mysql');
const md5 = require('md5');
const nodemailer = require('nodemailer');

async function getSql(query, queryVar = []) {
    return new Promise((resolve, reject) => {

        var con = mysql.createConnection({
            host: "mysql743.umbler.com",
            user: "rodrigoref",
            password: "l)_tM857J#Gj",
            database: "rfinanca"
            // host: "localhost",
            // user: "rodrigo",
            // password: "rodrigo",
            // database: "rfinanca"
        });

        con.query('CREATE TABLE if not exists `movimentacoes` (`id` int(11) NOT NULL AUTO_INCREMENT, `idUsuario` int(11) NOT NULL, `descricaoTipo` text NOT NULL, `descricao` text NOT NULL, `valor` float NOT NULL, `tipo` varchar(1) NOT NULL, `data` date NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4');
        con.query('CREATE TABLE if not exists `usuario` ( `id` int(11) NOT NULL AUTO_INCREMENT, `nome` text NOT NULL, `sobrenome` text NOT NULL, `email` text NOT NULL, `senha` text NOT NULL, `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `salario` float NOT NULL,PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1');

        var teste = con.query(query, queryVar, function (err, result) {
            if (err) {
                console.log(teste.sql);
                return reject(err);
            }
            console.log("MYSQL: " + teste.sql);
            con.end();
            resolve({ 'inserted': result.insertId, 'result': result });
        })
    });



}

const transporter = nodemailer.createTransport({
    host: 'smtp.umbler.com',
    port: 587,
    auth: {
        user: 'rodrigo.suporte@rfinanca.com',
        pass: 'Pu?TR*gK86'
    }
});

function dataAtualFormatada(dataa) {
    var data = new Date(dataa);

    var dia = data.getDate();

    dia = dia.toString();

    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString();
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();

    //return diaF + "/" + mesF + "/" + anoF;
    return diaF + "/" + mesF + "/" + anoF;
}

function dataAtualFormatadaSql(diasAdd) {
    var data = new Date();

    var dia = data.getDate() + (diasAdd ? diasAdd : 0);

    dia = dia.toString();

    var diaF = (dia.length == 1) ? '0' + dia : dia;
    var mes = (data.getMonth() + 1).toString();
    var mesF = (mes.length == 1) ? '0' + mes : mes;
    var anoF = data.getFullYear();

    //return diaF + "/" + mesF + "/" + anoF;
    return anoF + "/" + mesF + "/" + diaF;
}

function diaSemana() {

    let dia = new Date().getDay();
    let semana = new Array(6);
    semana[0] = 'Domingo';
    semana[1] = 'Segunda-Feira';
    semana[2] = 'Terça-Feira';
    semana[3] = 'Quarta-Feira';
    semana[4] = 'Quinta-Feira';
    semana[5] = 'Sexta-Feira';
    semana[6] = 'Sábado';

    return semana[dia];

}

function horaAtual() {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':');
}

function getDataHora(hora) {

    let horas = hora ? hora : horaAtual();
    return dataAtualFormatada() + " " + horas;
}

module.exports = {
    getSql,
    transporter,
    dataAtualFormatadaSql,
    dataAtualFormatada
}
