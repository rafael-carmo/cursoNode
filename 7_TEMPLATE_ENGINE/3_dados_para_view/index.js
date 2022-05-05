const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
    const user = {
        name: 'Rafael',
        surname: 'Linsmar',
        age: 30
    }

    const palavra = 'teste'
    //o primeiro user é a variavel que vai referenciada lá no html
    res.render('home', {user : user, palavra})
})

app.listen(3000, ()=>{
    console.log('App funcionando!')
})