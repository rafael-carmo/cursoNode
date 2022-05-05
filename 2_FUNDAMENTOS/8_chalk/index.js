const chalk = require('chalk');

const nota = 5;

if(nota >= 7){
    console.log(chalk.green('parabens, você está aprovado'));
} else {
    console.log(chalk.bgRed.black('voce precisa fazer a prova de recuperação'));
}
