const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

readline.question('qual a sua linguagem preferida? ',(language)=>{
    console.log(`a minha linguagem preferida é: ${language}`);
    readline.close()
})