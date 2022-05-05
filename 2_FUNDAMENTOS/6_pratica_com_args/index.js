const minimist = require('minimist');
console.log(process.argv);

//externo
const args = minimist(process.argv.slice(2));

//interno
const soma = require('./soma').soma;

const a = parseInt(args['a']);
const b = parseInt(args['b']);

soma(a,b);
