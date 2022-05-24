const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://usuario:senha@enderecoDoBanco:5432/nomeDoBanco')

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso com o Sequelize!')
} catch (error) {
    console.log('Não foi possível conectar: ', error)
}

exports.default = sequelize