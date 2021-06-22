const utils = require('../utils');
const sessionController = require('./session.controller');
const md5 = require('md5');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./autologin');
var pdf = require('html-pdf');
const { base64encode, base64decode } = require('nodejs-base64');

async function telaLogin(req, res) {
    await logarAuto(req, res);

    if (!sessionController.hasLogado(req)) {

        res.render(process.cwd() + "/cliente/pages/login.ejs");

    } else {
        res.redirect('/user/');
    }

}

async function telaRelatorios(req, res) {
    await logarAuto(req, res);

    if (sessionController.hasLogado(req)) {

        res.render(process.cwd() + "/cliente/pages/relatorio.ejs");

    } else {
        res.redirect('/user/login');
    }

}

async function telaRegister(req, res) {

    if (!sessionController.hasLogado(req)) {
        res.render(process.cwd() + "/cliente/pages/register.ejs");
    } else {
        res.redirect('/user/');
    }

}

async function telaForgetpass(req, res) {

    if (!sessionController.hasLogado(req)) {
        if (req.query.id) {
            res.render(process.cwd() + "/cliente/pages/forgetpass.ejs", {
                tipo: 1
            });
        } else {
            res.render(process.cwd() + "/cliente/pages/forgetpass.ejs", {
                tipo: 0
            });
        }
    } else {
        res.redirect('/user/');
    }

}

async function telaIndex(req, res) {


    res.render(process.cwd() + "/index/index.ejs");


}

async function telaUserIndex(req, res) {

    await logarAuto(req, res);

    if (sessionController.hasLogado(req)) {

        res.render(process.cwd() + "/cliente/pages/index.ejs");

    } else {
        res.redirect('/user/login');
    }
}

async function telaMovimentacao(req, res) {

    await logarAuto(req, res);

    if (sessionController.hasLogado(req)) {

        res.render(process.cwd() + "/cliente/pages/movimentacao.ejs");

    } else {
        res.redirect('/user/login');
    }
}


async function telaCriarMovimentacao(req, res) {

    await logarAuto(req, res);


    if (sessionController.hasLogado(req)) {

        if (req.params.id) {

            let paramId = req.params.id;

            let sql = await utils.getSql('SELECT * FROM movimentacoes WHERE id = ?  ORDER BY `movimentacoes`.`data` ASC', [paramId]).catch(() => {
                paramId = 0;
            });

            if (!sql.result || !sql.result[0]) {
                paramId = 0;
            } else {
                if (sql.result[0].idUsuario != req.session.conta.id) {
                    paramId = 0;
                }
            }

            res.render(process.cwd() + "/cliente/pages/criarmovimentacao.ejs", {
                id: paramId
            });
        } else {
            res.render(process.cwd() + "/cliente/pages/criarmovimentacao.ejs", {
                id: 0
            });
        }

    } else {
        res.redirect('/user/login');
    }
}
async function login(req, res) {

    if (req.body.email && req.body.password && req.body.checkbox) {

        let email = req.body.email;
        let senha = md5(req.body.password);
        let checkbox = req.body.checkbox;

        try {

            let retorno = await fazerLogin(email, senha, req, res, checkbox);
            res.send(retorno);

        } catch (error) {
            res.send(JSON.stringify({ error: true, msg: 'Ocorreu um erro ao validar suas informações.' }));
        }

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos' }));
    }

}

async function fazerLogin(email, senha, req, res, checkbox = 0) {
    return new Promise((resolve, reject) => {
        utils.getSql('SELECT * FROM `usuario` WHERE email = ? AND senha = ?', [email, senha]).then((result) => {

            if (result.result && result.result[0]) {
                result = result.result[0];

                var nome = result.nome;

                sessionController.setSession(req, result);

                if (checkbox > 0) {

                    let options = {
                        maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 15 minutes
                        httpOnly: true, // The cookie only accessible by the web server
                        signed: true // Indicates if the cookie should be signed
                    }

                    // Set cookie
                    res.cookie('loginAutoMagic', base64encode(`${email}:${senha}`), options) // options is optional
                }

                resolve(JSON.stringify({ error: false, msg: `Olá, ${nome}` }));
            } else {
                resolve(JSON.stringify({ error: true, msg: 'Email e/ou senha incorretos!' }));
            }
        });
    });
}

async function register(req, res) {

    if (req.body.nome && req.body.sobrenome && req.body.email && req.body.senha) {

        let nome = req.body.nome;
        let sobrenome = req.body.sobrenome;
        let email = req.body.email;
        let senha = md5(req.body.senha);

        try {

            let sqlLine = "INSERT INTO `usuario`(`id`, `nome`, `sobrenome`, `email`, `senha`, `data_cadastro`) VALUES (?, ?, ?, ?, ?, ?)";

            let login = await utils.getSql('SELECT * FROM `usuario` WHERE email = ? ', [email]);

            if (login.result && login.result[0]) {
                res.send(JSON.stringify({ error: true, msg: `Email já esta sendo utilizado!` }));
                return;
            }

            let insert = await utils.getSql(sqlLine, [
                , nome, sobrenome, email, senha, Date.now()
            ]);

            if (insert.inserted) {
                res.send(JSON.stringify({ error: false, msg: `Cadastrado com sucesso, agora faça o login!` }));
            } else {
                res.send(JSON.stringify({ error: true, msg: 'Ocorreu um erro ao salvar suas informações.' }));
            }

        } catch (error) {
            res.send(JSON.stringify({ error: true, msg: 'Ocorreu um erro ao validar suas informações.' }));
        }

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos' }));
    }

}

async function enviarEmailReset(req, res) {
    if (req.body.email) {

        let email = req.body.email;

        utils.getSql('SELECT * FROM usuario WHERE email = ?', [email]).then(async (result) => {

            if (result.result && result.result[0]) {

                let idSql = await utils.getSql('SELECT md5(id) FROM `usuario` WHERE id = ?', [result.result[0].id]);

                idSql = idSql.result[0]['md5(id)'];

                utils.transporter.sendMail({
                    from: 'rodrigo.suporte@rfinanca.com',
                    to: email,
                    subject: 'Redefinir senha rFinança, ' + result.result[0].nome,
                    html: `
                    Olá, ${result.result[0].nome} para redefinir sua senha clique <a href="https://rfinanca.com/user/forgetPass?id=${idSql}">aqui</a></br>
                    ou acesse <a href="https://rfinanca.com/user/forgetpass?id=${idSql}">https://rfinanca.com/forgetpass?id=${idSql}</a>
                    `
                }).then(() => {
                    res.send(JSON.stringify({ error: false, msg: 'Link enviado, verifique sua caixa de email.' }));
                }).catch((e, ee) => {
                    res.send(JSON.stringify({ error: true, msg: 'Ocorreu um erro tente novamente' }));
                });

            } else {
                res.send(JSON.stringify({ error: true, msg: 'Email não encontrado' }));
            }
        });

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos' }));
    }
}

async function alterarSenha(req, res) {
    if (req.body.email && req.body.id) {

        let email = req.body.email;
        let id = req.body.id;

        utils.getSql('SELECT * FROM usuario WHERE md5(id) = ?', [id]).then((result) => {
            if (result.result && result.result[0]) {

                utils.getSql('UPDATE `usuario` SET `senha`= ? WHERE md5(id) = ?', [md5(email), id]);
                res.send(JSON.stringify({ error: false, msg: 'Senha alterada' }));
            } else {
                res.send(JSON.stringify({ error: true, msg: 'Codigo de alteração não encontrado!' }));
            }
        });

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos' }));
    }
}

async function getMovimentacoes(req, res) {

    if (sessionController.hasLogado(req)) {

        let id = req.session.conta.id;

        utils.getSql('SELECT * FROM movimentacoes WHERE idUsuario = ?  ORDER BY `movimentacoes`.`data` ASC', [id]).then((result) => {
            if (result.result && result.result[0]) {

                res.send(JSON.stringify({ error: false, retorno: result.result }));

            } else {
                res.send(JSON.stringify({ error: true, msg: 'Sem movimentação' }));
            }
        });

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Você precisa estar logado' }));
    }

}

async function criarMovimentacao(req, res) {

    if (sessionController.hasLogado(req)) {

        if (req.body.descricao && req.body.id && req.body.data && req.body.tipoMovimentacao && req.body.debitoOuCredito && req.body.valor) {

            let descricao = req.body.descricao;
            let debitoOuCredito = req.body.debitoOuCredito;
            let valor = req.body.valor;
            let sessionId = req.session.conta.id;
            let dataSql = req.body.data;
            let tipoMovimentacao = req.body.tipoMovimentacao;
            let id = req.body.id;

            let sql = "", sqlA = [];

            if (id == 0) {
                sql = "INSERT INTO `movimentacoes`(`id`, `idUsuario`, `descricaoTipo`, `descricao`, `valor`, `tipo`, `data`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                sqlA = [, sessionId, tipoMovimentacao, descricao, valor, debitoOuCredito, dataSql];
            } else {
                sql = "UPDATE `movimentacoes` SET `descricaoTipo`= ?,`descricao`= ?,`valor`= ?,`tipo`= ?,`data`= ? WHERE id = ?"
                sqlA = [tipoMovimentacao, descricao, valor, debitoOuCredito, dataSql, id];
            }

            utils.getSql(sql, sqlA).then((result) => {
                if (id <= 0) {
                    if (result && result.inserted) {

                        res.send(JSON.stringify({ error: false, retorno: 'Movimentação inserida.' }));

                    } else {
                        res.send(JSON.stringify({ error: true, msg: 'Ocorreu algum erro ao inserir!' }));
                    }

                } else {
                    res.send(JSON.stringify({ error: false, retorno: 'Movimentação alterada.' }));
                }
            }).catch(() => {
                res.send(JSON.stringify({ error: true, msg: 'Ocorreu algum erro ao inserir, catch!' }));
            });
        } else {
            res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos!' }));
        }

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Você precisa estar logado' }));
    }

}

async function deletarMovimentacao(req, res) {

    if (sessionController.hasLogado(req)) {

        if (req.body.id) {

            let id = req.body.id;
            let sessionId = req.session.conta.id;

            utils.getSql('DELETE FROM `movimentacoes` WHERE id = ? AND idUsuario = ?', [id, sessionId]).then((result) => {

                res.send(JSON.stringify({ error: false, retorno: 'Movimentação deletada' }));

            }).catch(() => {
                res.send(JSON.stringify({ error: true, msg: 'Ocorreu algum erro ao deletar, catch!' }));
            });

        } else {
            res.send(JSON.stringify({ error: true, msg: 'Argumentos invalidos!' }));
        }

    } else {
        res.send(JSON.stringify({ error: true, msg: 'Você precisa estar logado' }));
    }

}

async function logarAuto(req, res) {
    return new Promise(async (resolve, reject) => {

        if (!req.headers.cookie) {
            resolve(true);
            return;
        }
        var cookie = req.headers.cookie.split('; ');
        for (var i = 0; i < cookie.length; i++) {
            if (cookie[i].indexOf('loginAutoMagic') > -1) {
                if (!sessionController.hasLogado(req)) {

                    let login = cookie[i].trim().split('loginAutoMagic=')[1]
                    login = login.substr(4, login.length - 1);
                    login = login.split(".")[0];
                    login = base64decode(login);
                    login = login.split(":");

                    let retorno = await fazerLogin(login[0], login[1], req, res);
                    resolve(true);
                }
            }
        }

        resolve(false);

    });
}

async function relatorioPrimario(req, res) {

    await logarAuto(req, res);

    if (sessionController.hasLogado(req) && req.body.mes) {

        let mes = req.body.mes;
        let ano = new Date().getFullYear();

        let sql = `SELECT * FROM movimentacoes WHERE idUsuario = ? AND data between '${ano}-${mes}-01 00:00:00' AND '${ano}-${mes}-31 23:59:59'`;

        utils.getSql(sql, [req.session.conta.id]).then(async (result) => {
            if (result.result && result.result[0]) {

                let html = `<center>Relatorio de movimentações, mes: ${mes}</center><br/><hr/>`;
                html += `
                <table style="width:100%; text-align: left;">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                `;
                var totalCredito = 0, totalDebito = 0;

                for (var i = 0; i < result.result.length; i++) {


                    if (result.result[i].tipo.toUpperCase() == 'C') {
                        totalCredito += result.result[i].valor;
                    } else {
                        totalDebito += result.result[i].valor;
                    }

                    html += `
                    <tr>
                    <td>${utils.dataAtualFormatada(result.result[i].data)}</td>
                    <td>${result.result[i].descricao}</td>
                    <td>${result.result[i].tipo == 'D' ? 'Debito' : 'Credito'}</td>
                    <td>${convertParaReal(result.result[i].valor)}</td>
                    </tr>`;
                }

                html += `</table>`;

                html += `
                    <div style="width:100%; text-align: right;">
                    <h4><b>Debitos: </b>${convertParaReal(totalDebito)}</h4>
                    <h4><b>Creditos: </b>${convertParaReal(totalCredito)}</h4>
                    </div>
                `;

                var options = { format: 'Letter' };
                var nomePdf = `./relatorios/${req.session.conta.id}_${Date.now()}_relatorio.pdf`;

                pdf.create(html, options).toFile(nomePdf, function (err, resPdf) {
                    if (err){
                        res.send(JSON.stringify({ error: true, msg: 'Ocorreu um erro ao gerar relatorio' }));
                        return;
                    }
                    res.send(JSON.stringify({ error: false, msg: 'Relatorio gerado', 'nomePdf': nomePdf }));
                });

    
            } else {
                res.send(JSON.stringify({ error: true, msg: 'Nenhum dano encontrado!' }));
            }
        });
    } else {
        res.send(JSON.stringify({ error: true, msg: 'Você precisa estar logado' }));
    }

}

function convertParaReal(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    })
}

module.exports = {
    telaLogin,
    telaRegister,
    telaIndex,
    telaUserIndex,
    login,
    register,
    telaForgetpass,
    enviarEmailReset,
    alterarSenha,
    telaMovimentacao,
    telaCriarMovimentacao,
    getMovimentacoes,
    criarMovimentacao,
    deletarMovimentacao,
    fazerLogin,
    relatorioPrimario,
    telaRelatorios
}