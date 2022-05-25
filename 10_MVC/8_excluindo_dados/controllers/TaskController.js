const Task = require('../models/Task')


//usado dessa forma pois não será necessário instanciar os objetos

module.exports = class TaskController {
    static createTask(req, res) {
        res.render('tasks/create')
    }

    static async createTaskSave(req, res) {

        //criar objeto que será inserido
        const task = {
            title: req.body.title,
            description: req.body.description,
            done: false
        }

        //fazer operação de salvar item
        await Task.create(task)

        //redirecionar para tela de listagem
        res.redirect('/tasks')
    }

    static async removeTask(req, res) {
        const id = req.body.id

        await Task.destroy({where: {id}})

        res.redirect('/tasks')
    }
    
    static async showTasks(req, res) {

        const tasks = await Task.findAll({raw: true})

        res.render('tasks/all', {tasks: tasks})
    }

    

}