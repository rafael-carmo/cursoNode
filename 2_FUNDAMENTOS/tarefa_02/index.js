const chalk = require('chalk');
const inquirer = require('inquirer');

inquirer.prompt([{
    name: 'nome', message: 'Qual o seu nome?'
},
{
    name: 'idade', message: 'Qual a sua idade?'
}])
.then((answers) => {
    console.log(chalk.bgYellow.black(`Nome: ${answers.nome}`))
    console.log(chalk.bgYellow.black(`Idade: ${answers.idade}`))
})
.catch(err => console.log(chalk.bgRed.black(err)))