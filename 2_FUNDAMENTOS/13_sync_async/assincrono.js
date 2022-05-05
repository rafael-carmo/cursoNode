const fs = require('fs')

console.log('inicio')

fs.writeFile('arquivo.txt','escrevendo de forma sincrona',(err)=>{
    setTimeout(() => {
        console.log('arquivo criado')
    }, 1000);
})

console.log('fim')