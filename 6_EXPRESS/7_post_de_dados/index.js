const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

//ler o body
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//basePath é a pasta 3_render_html
//_dirname = é o diretorio atual
const basePath = path.join(__dirname, 'templates')

app.get('/users/add', (req,res) => {
    res.sendFile(`${basePath}/userform.html`)
})

app.post('/users/save', (req, res) => {
    console.log(req.body)

    const name = req.body.name;
    const age = req.body.age;

    console.log(`O nome do usuário é ${name} e ele(a) tem ${age} anos`)

    res.sendFile(`${basePath}/userform.html`)
})

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