const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://xfweb:jadefluorescente@10.41.246.130:5432/pcivil-srh-teste')

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso com o Sequelize!')
} catch (error) {
    console.log('Não foi possível conectar: ', error)
}

module.exports = sequelize

