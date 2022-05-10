const express = require('express')
const exphbs = require('express-handlebars')
const { Pool } = require('pg')
const connectionString = 'porgresql://xfweb:jadefluorescente@10.41.246.130:5432/pcivil-srh-teste';

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

        res.redirect('/books')
    })
})

app.get('/books', (req, res) => {
    const sql = `SELECT * FROM node_books`
    pool.query(sql, (err, data) => {
        if (err) {
            console.error('Erro ao inserir informação: ', err)
            return
        }

        const id = 2

        const books = data.rows
        res.render('books', { books })

    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM node_books WHERE id = ${id}` //retorna um array

    pool.query(sql, (err, data) => {
        if (err) {
            console.error('Erro ao buscar book: ', err)
            return
        }

        const book = data.rows[0]
        res.render('book', { book })
    })
})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM node_books WHERE id = ${id}`

    pool.query(sql, (err, data) => {
        if (err) {
            console.error('Erro ao buscar book: ', err)
            return
        }

        const book = data.rows[0];
        res.render('editbook', { book })
    })
}) 

app.post('/books/updatebook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pagesqty = req.body.pagesqty

    const sql = `UPDATE node_books SET title='${title}', pagesqty='${pagesqty}' WHERE id=${id}`

    pool.query(sql, (err) => {
        if(err){
            console.error('Erro ao atualizar book: ', err)
            return
        }

        res.redirect('/books')
    })

})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM node_books WHERE id = ${id}`

    pool.query(sql, (err) => {
        if(err){
            console.error('Erro ao excluir book: ', err)
        }

        res.redirect('/books')
    })
})

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
