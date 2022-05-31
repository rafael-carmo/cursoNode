module.exports.checkAuth = function (req, res, next) {
    const userId = req.session.userid
    
    //se o usuário não estiver logado, redireciona para página de login
    if(!userId) {
        console.log('usuario logado: ' + userId)
        res.redirect('/login')
    }

    //usuário logado, segue para página solicitada
    next()
}