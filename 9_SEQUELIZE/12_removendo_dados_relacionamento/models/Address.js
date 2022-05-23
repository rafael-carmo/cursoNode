const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

const Address = db.define('Address', {
    street: {
        type: DataTypes.STRING,
        required: true,
    },
    number: {
        type: DataTypes.STRING,
        required: true,
    },
    city: {
        type: DataTypes.STRING,
        required: true,
    },
})

//Um usuário possui vários endereços
User.hasMany(Address)
//Um endereço pertence a um usuário
Address.belongsTo(User)

module.exports = Address