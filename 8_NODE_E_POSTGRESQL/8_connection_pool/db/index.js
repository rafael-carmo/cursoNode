const { Pool } = require('pg')

const connectionString = 'postgres://usuario:senha@enderecoDoBanco:5432/nomeDoBanco';

const pool = new Pool({
    connectionString,
})

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
}