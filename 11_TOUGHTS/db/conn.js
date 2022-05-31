const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://usuario:senha@enderecoDoBanco:5432/nomeDoBanco')

try {
    sequelize.authenticate()
    console.log('Conectado ao sequelize com sucesso!!')
} catch (error) {
    console.log(`Não foi possível conectar: ${error}`)
}

module.exports = sequelize