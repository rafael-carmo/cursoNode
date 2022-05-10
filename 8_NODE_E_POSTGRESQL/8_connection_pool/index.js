const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./db')

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
    

    db.query(sql, (err) => {
        if (err) {
            console.error('Erro ao inserir informação: ', err)
        }

        res.redirect('/books')
    })
})

app.get('/books', (req, res) => {
    const sql = `SELECT * FROM node_books`
    db.query(sql, (err, data) => {
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

    db.query(sql, (err, data) => {
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

    db.query(sql, (err, data) => {
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

    db.query(sql, (err) => {
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

    db.query(sql, (err) => {
        if(err){
            console.error('Erro ao excluir book: ', err)
        }

        res.redirect('/books')
    })
})


app.listen(3000);


