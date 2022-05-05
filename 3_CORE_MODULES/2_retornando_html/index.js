const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');//habilitando para escrever html
    res.end('<h1>Olá, este é meu primeiro server com HTML!</h1><p>Testando atualização</p>')

    //Finalizar resposta pra não ficar escutando eternamente
    res.end()
})

//Escutando porta
server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})