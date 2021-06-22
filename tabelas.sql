CREATE TABLE `movimentacoes` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `idUsuario` int(11) NOT NULL,
 `descricaoTipo` text NOT NULL,
 `descricao` text NOT NULL,
 `valor` float NOT NULL,
 `tipo` varchar(1) NOT NULL,
 `data` date NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `usuario` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `nome` text NOT NULL,
 `sobrenome` text NOT NULL,
 `email` text NOT NULL,
 `senha` text NOT NULL,
 `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `salario` float NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;