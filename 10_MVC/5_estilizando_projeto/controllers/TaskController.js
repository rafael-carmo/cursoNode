const Task = require('../models/Task')


//usado dessa forma pois não será necessário instanciar os objetos

module.exports = class TaskController {
    static createTask(req, res) {
        res.render('tasks/create')
    }

    static showTasks(req, res) {
        res.render('tasks/all')
    }

    static save(req, res) {
        //fazer operação de salvar item

        //redirecionar para tela de listagem
        res.redirect('/')
    }
}