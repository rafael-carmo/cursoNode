const express = require('express')
const exphbs = require('express-handlebars')
const { Pool } = require('pg')
const sequelize = new Sequelize('postgres://usuario:senha@enderecoDoBanco:5432/nomeDoBanco')

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pagesqty = req.body.pagesqty

    const sql = `INSERT INTO node_books (title, pagesqty) VALUES ('${title}', '${pagesqty}')`

    pool.query(sql, (err) => {
        if (err) {
            console.error('Erro ao inserir informação: ', err)
        }

        res.redirect('/')
    })
})

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

const pool = new Pool({
    connectionString,
})


pool
    .connect()
    .then(client => {
        return client
            .query('SELECT NOW()')
            .then(res => {
                // client.release()
                console.log('Conectou ao banco')
                app.listen(3000);
            })
            .catch(err => {
                // client.release()
                console.log(err.stack)
            })
    })


// pool.query('SELECT NOW()', (err, res) => {
//     if(err){
//         console.log('Erro ao conectar no banco: '+ err)
//     }

//     console.log('Conectou ao PostgreSQL: '+ err)
//     app.listen(3000)
// })
