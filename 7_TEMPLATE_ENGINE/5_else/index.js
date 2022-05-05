const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.get('/', (req, res) => {
    const user = {
        name: 'Rafael',
        surname: 'Linsmar',
        age: 30
    }

    const palavra = 'teste'
    const auth = true
    const approved = true
    //o primeiro user é a variavel que vai referenciada lá no html
    res.render('home', {user : user, palavra, auth, approved})
})

app.listen(3000, ()=>{
    console.log('App funcionando!')
})