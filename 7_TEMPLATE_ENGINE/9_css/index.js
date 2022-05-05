const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

//configurando a partials
const hbs = exphbs.create({
    partialsDir: ['views/partials'], //diretorio no partials
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//define pasta dos arquivos estaticos: css, images, etc
app.use(express.static('public'))

app.get('/dashboard', (req, res) => {
    const items = ['Item a', 'Item b', 'Item c']
    res.render('dashboard', {items})
})

app.get('/post', (req, res) => {
    const post = {
        title: 'Aprender Node.js',
        category: 'JavaScript',
        body: 'Este artigo vai te ajudar a aprender Node.js....',
        comments: 4,
    }

    res.render('blogpost', {post})
})

app.get('/blog', (req, res) => {
    const posts = [
        {
            title: 'Aprender Node.js',
            category: 'JavaScript',
            body: 'Teste',
            comments: 4
        },
        {
            title: 'Aprender PHP',
            category: 'PHP',
            body: 'Teste',
            comments: 2
        },
        {
            title: 'Aprender Java',
            category: 'Java',
            body: 'Teste',
            comments: 10
        },
    ]

    res.render('blog', {posts})
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