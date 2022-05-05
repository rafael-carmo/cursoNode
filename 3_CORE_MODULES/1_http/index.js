const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {

    //Escreve mensagem para o usuário
    res.write('Oi HTTP');

    //Finalizar resposta pra não ficar escutando eternamente
    res.end()
})

//Escutando porta
server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})