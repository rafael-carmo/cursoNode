const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const usersRouter = require('./users');

//ler o body
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//arquivos estaticos
//Indica a pasta responsavel por guardar os "assets", que o local onde ficarão
//imagens, arquivos css, etc.
app.use(express.static('public'))

//basePath é a pasta 3_render_html
//_dirname = é o diretorio atual
const basePath = path.join(__dirname, 'templates')


app.use('/users',usersRouter)

app.get('/', (req, res) => {
    //envia arquivo
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, ()=>{
    console.log(`App rodando na porta ${port}`);
})