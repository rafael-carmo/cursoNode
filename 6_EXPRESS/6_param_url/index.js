const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

//basePath é a pasta 3_render_html
//_dirname = é o diretorio atual
const basePath = path.join(__dirname, 'templates')


app.get('/users/:id', (req, res) => {
    const id = req.params.id

    //leitura da tabela users, resgatar um usuário
    console.log(`Estamos buscando pelo usuário ${id}`)

    //envia arquivo
    res.sendFile(`${basePath}/users.html`)
})


app.get('/', (req, res) => {
    //envia arquivo
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, ()=>{
    console.log(`App rodando na porta ${port}`);
})

