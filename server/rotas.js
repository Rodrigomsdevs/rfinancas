const router = require("express").Router();

const usuario = require('./controller/usuario.controller');
const sessionC = require('./controller/session.controller');

router.get('/', usuario.telaIndex);
router.get('/user', usuario.telaUserIndex);
router.get('/user/login', usuario.telaLogin);
router.get('/user/register', usuario.telaRegister);
router.get('/user/forgetpass', usuario.telaForgetpass);
router.get('/user/movimentacao', usuario.telaMovimentacao);
router.get('/user/criar/movimentacao', usuario.telaCriarMovimentacao);
router.get('/user/criar/movimentacao/:id', usuario.telaCriarMovimentacao);
router.get('/user/relatorios', usuario.telaRelatorios);

router.post('/api/gerarRelatorio', usuario.relatorioPrimario);
router.post('/api/login', usuario.login);
router.post('/api/register', usuario.register);
router.post('/api/forgetpassEmail', usuario.enviarEmailReset);
router.post('/api/alterarSenha', usuario.alterarSenha);
router.post('/api/getMovimentacoes', usuario.getMovimentacoes);
router.post('/api/criar/movimentacao', usuario.criarMovimentacao);


router.delete('/api/deletarMovimentacao', usuario.deletarMovimentacao);

module.exports = router;