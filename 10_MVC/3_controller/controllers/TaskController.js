const Task = require('../models/Task')


//usado dessa forma pois não será necessário instanciar os objetos

module.exports = class TaskController {
    static createTask(req, res) {
        res.render('tasks/create')
    }
}