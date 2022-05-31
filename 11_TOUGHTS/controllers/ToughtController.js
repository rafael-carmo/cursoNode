const Tought = require('../models/Tought')
const User = require('../models/User')
const { Op } = require('sequelize')


module.exports = class ToughtController {
    
    static async showToughts(req, res) {

        let search = ''
        let order = 'DESC'

        if (req.query.search){
            search = req.query.search
        }

        if(req.query.order){
            order = req.query.order === 'new' ? 'DESC' : 'ASC'
        }

        await Tought.findAll({
            include: User,
            where: {
                title: {
                    [Op.iLike]: `%${search}%`
                },
            },
            order: [
                ['createdAt', order],
            ],
        })
        .then((data) => {

            //o atributo plain, retorna todos os dados no mesmo array
            const toughts = data.map((result) => result.get({ plain: true }))

            let toughtsQty = toughts.length

            if(toughtsQty === 0) {
                toughtsQty = false
            }

            res.render('toughts/home', { toughts, search, toughtsQty })
        })
    }

    static async removeTought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        await Tought.destroy({
            where: {
                id,
                UserId: UserId,
            },
        })
        .then(() => {
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        })
        .catch((err) => console.log('Erro ao excluir pensamento: ' + err))
    }

    static async updateTought(req, res) {
        const id = req.params.id

        await Tought.findOne({raw: true, where : {id}})
        .then((tought) => {
            res.render('toughts/edit', {tought})
        })
        .catch((err) => console.log('Erro ao buscar para atualizar pensamento: ' + err))
    }

    static async updateToughtSave(req, res) {
        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        await Tought.update(tought, {where: {id}})
        .then((tought) => {
            req.flash('message','Pensamento atualizado com sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        })
        .catch((err) => console.log(err))
    }

    static async dashboard(req, res) {

        const userId = req.session.userid

        //recupera um usuário pelo id, caso exista, e já tras todos os seus pensamentos (include: Tought)
        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Tought,
            plain: true, //retorna apenas os dados "limpos"
        })

        //verifica se usuári existe
        if(!user) {
            res.redirect('/login')
        }

        
        //o que precisa para mostrar na tela é apenas o conteudo do dataValues
        const toughts = user.Toughts.map((result)=> result.dataValues)

        let emptyToughts = false

        if(toughts.length === 0){
            emptyToughts = true
        }

        res.render('toughts/dashboard', {toughts, emptyToughts})
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {

        
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        await Tought.create(tought)
        .then((tought) => {
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        })
        .catch((err) => console.log(err))
    }
}