const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {

    const urlInfo = require('url').parse(req.url, true);
    const name = urlInfo.query.name;

    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');//habilitando para escrever html
    
    if(!name) {
        res.end('<h1>Preencha seu nome:</h1><form method="GET"><input type="text" name="name" /><input type="submit"/></form>')
    } else {
        res.end(`<h1>Olá, seja bem vindo ${name}</h1>`);
    }

})

//Escutando porta
server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})