const { Pool } = require('pg')

const connectionString = 'porgresql://xfweb:jadefluorescente@10.41.246.130:5432/pcivil-srh-teste';

const pool = new Pool({
    connectionString,
})

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
}