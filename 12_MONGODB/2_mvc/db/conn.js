const {MongoClient} = require('mongodb')

//o banco será criado automaticamente caso não exista
//27017: porta do mongo
const uri = "mongodb://localhost:27017/testemongodb"

const client = new MongoClient(uri)

async function run() {
    try {
        //inicia conexão com mongodb
        await client.connect()
        console.log("Conectando ao mongoDB!")
    } catch (error) {
        console.log(error)
    }
}

run()

module.exports = client