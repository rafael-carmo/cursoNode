const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

//basePath é a pasta 3_render_html
//_dirname = é o diretorio atual
const basePath = path.join(__dirname, 'templates')

//simula a verificação de uma autenticação
const checkAuth = function(req, res, next) {
    req.authStatus = true;

    if(req.authStatus){
        console.log('Esta logado, pode continuar')
        next()
    } else {
        console.log('Não está logado, faça o login para continuar')
        next()
    }
}

app.use(checkAuth);

app.get('/', (req, res) => {
    //envia arquivo
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, ()=>{
    console.log(`App rodando na porta ${port}`);
})