const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

//import models
const Task = require('./models/Task')

//import das rotas
const tasksRoutes = require('./routes/tasksRoutes')


const conn = require('./db/conn')

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
app.use(express.static('public'))

app.use('/tasks', tasksRoutes)

conn.sync()
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))
