const express = require('express')
const router = express.Router()
const path = require('path');

//basePath é a pasta 3_render_html
//_dirname = é o diretorio atual
const basePath = path.join(__dirname, '../templates')

router.get('/add', (req,res) => {
    res.sendFile(`${basePath}/userform.html`)
})

router.post('/save', (req, res) => {
    console.log(req.body)

    const name = req.body.name;
    const age = req.body.age;

    console.log(`O nome do usuário é ${name} e ele(a) tem ${age} anos`)

    res.sendFile(`${basePath}/userform.html`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    //leitura da tabela users, resgatar um usuário
    console.log(`Estamos buscando pelo usuário ${id}`)

    //envia arquivo
    res.sendFile(`${basePath}/users.html`)
})

module.exports = router

