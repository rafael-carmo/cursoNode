const { application } = require('express')
const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')

const User = require('./models/User')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())



app.use(express.static('public'))

app.get('/users/create', (req, res) => {
    res.render('adduser')
})
app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    const newsletter = req.body.newsletter === 'on' ? true : false

    const user = {
        name,
        occupation,
        newsletter
    }
    console.log(req.body)
    await User.create(user)
    res.redirect('/')
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({raw: true, where: {id}})
    res.render('userview', {user})
})

app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id
    await User.destroy({where: {id}})
    res.redirect('/')
})

app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({raw: true, where: {id}})

    res.render('useredit', {user})
})
app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    const newsletter = req.body.newsletter ? true : false

    const user = {
        id,
        name,
        occupation,
        newsletter
    }

    await User.update(user, {where: {id}})
    res.redirect('/')
})

app.get('/', async (req, res) => {
    const users = await User.findAll({raw: true})
    console.log(users)
    res.render('home', {users: users})
})

conn
.sync() 
//force: usado quando quer que as tabelas sejam recriadas (perda total dos dados)
// .sync({force: true})
.then(() => {
    app.listen(3000);

})
.catch(err => console.log(err))




