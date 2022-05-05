//modulos externos
const inquirer = require('inquirer');
const chalk = require('chalk')

//modulos internos
const fs = require('fs')


const operation = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
        .then((answer) => {
            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Consultar Saldo') {
                getAccountBalance();
            } else if (action === 'Depositar') {
                deposit();
            } else if (action === 'Sacar') {
                widthdraw();
            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Account!'));
                process.exit();
            }
        })
        .catch(err => console.log(err))
}

//crate an account
const createAccount = () => {
    console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco"))
    console.log(chalk.bgGreen.black("Defina as opções da sua conta a seguir"))

    buildAccount();
}

const buildAccount = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        },
    ])
        .then((answer) => {
            const accountName = answer['accountName'];
            console.info(accountName)

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'));
                buildAccount();
                return
            }

            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}',
                function (err) {
                    console.log(err);
                })

            console.log(chalk.green("Parabéns, sua conta foi criada!!"))
            operation();

        })
        .catch(err => console.log(err))
}

const checkAccount = (accountName) => {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'));
        return false;
    }

    return true;
}

const addAmount = (accountName, amount) => {
    const accountData = getAccount(accountName);

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente'));
        return deposit();
    }

    //recuperar valor
    //somar com novo valor
    accountData.balance = parseFloat(accountData.balance) + parseFloat(amount);

    //inserir novo valor novamente no arquivo
    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

const getAccount = (accountName) => {
    //ler os dados que estão na conta
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r' //r - read
    })

    return JSON.parse(accountJSON);
}



//add an amount to user account
const deposit = () => {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta:'
    }])
        .then((answer) => {
            const accountName = answer['accountName'];

            //Verificar se a conta existe
            if (!checkAccount(accountName)) {
                return deposit();
            }

            //pegar valor para depósito
            inquirer.prompt([{
                name: 'amount',
                message: 'Quanto você deseja depositar:'
            }])
                .then((answer) => {
                    const amount = answer['amount'];

                    addAmount(accountName, amount);
                    operation();
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

const getAccountBalance = () => {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Conta a ser consultada:'
    }])
        .then((answer) => {
            const accountName = answer['accountName'];
            //recuperar conta e verificar se ela existe
            if (!checkAccount(accountName)) {
                return getAccountBalance();
            }
            //ler valor e mostrar na tela
            const account = getAccount(accountName);
            console.log(chalk.green(`Seu saldo é de: R$ ${account.balance}`))
            operation();
        })
        .catch(err => console.log(err))

}

const removeAmount = (accountName, amount) => {
    const accountData = getAccount(accountName);

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
        return widthdraw();
    }

    if(parseFloat(accountData.balance) < parseFloat(amount) ){
        console.log(chalk.bgRed.black('Você não possui saldo suficiente para realizar este saque!'))
        return widthdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
        console.log(err);
    })

    console.log(chalk.green(`Foi realizado um saque de R$ ${amount} da sua conta`));
    operation();

}

const widthdraw = () => {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Conta a realizar o saque: '
    }])
    .then((answer)=>{
        const accountName = answer['accountName'];
        
        //verificar se a conta existe
        if(!checkAccount(accountName)){
            return widthdraw();
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Valor a sacar: '
        }])
        .then((answer)=>{
            const amount = answer['amount'];

            removeAmount(accountName, amount);

        })
        .catch(err=>console.log(err))

    }).catch(err=>console.log(err))
}

operation();
