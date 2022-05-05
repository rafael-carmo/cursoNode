const minimist = require('minimist');
console.log(process.argv);

const args = minimist(process.argv.slice(2));
console.log(args);

const nome = args['nome'];
console.log(nome);

const profissao = args['profissao'];
console.log(profissao);