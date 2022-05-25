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

    static async updateTask(req, res) {
        const id = req.params.id

        const task = await Task.findOne({raw: true, where: {id}})

        res.render('tasks/edit', {task})
    }

    static async updateTaskPost(req, res) {
        const id = req.body.id

        const task = {
            id,
            title: req.body.title,
            description: req.body.description
        }
        await Task.update(task, {where: {id}})
        res.redirect('/tasks')
    }

    static async toggleTaskStatus(req, res) {
        const id = req.body.id
        
        const task = await Task.findOne({raw: true, where: {id}}) //melhor forma
        task.done = !task.done
        // const task = {
        //     done: req.body.done ? false : true
        // }

        await Task.update(task, {where: {id}})
        res.redirect('/tasks')
    }
    
    static async showTasks(req, res) {

        const tasks = await Task.findAll({raw: true})

        res.render('tasks/all', {tasks: tasks})
    }

    

}