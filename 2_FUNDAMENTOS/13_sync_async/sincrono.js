const fs = require('fs')

console.log('inicio')

fs.writeFileSync('arquivo.txt','escrevendo de forma sincrona')

console.log('fim')