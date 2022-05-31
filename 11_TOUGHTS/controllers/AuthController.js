const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        
        const { email, password } = req.body
        
        //verificar se usuario existe
        const user = await User.findOne({where: {email}})

        if(!user){
            req.flash('message','Usuário não encontrado!')
            res.render('auth/login')
            return
        }

        //verificar se senha confere
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message','Senha incorreta!')
            res.render('auth/login')
            return
        }

        req.session.userid = user.id
        req.session.username = user.name
        req.flash('message','Autenticação realizada com sucesso!')
        req.session.save(()=>{
            res.redirect('/')
        })
        
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        //password match validation
        if (password != confirmpassword) {
            //O flash message fica na requisição
            //estará disponível em main.handlebars, com a chave 'messages.message'
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        //check if user exists
        const checkIfUserExists = await User.findOne({ where: { email } })

        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')

            return
        }

        //create a password
        //acrescenta 10 caracteres para dificultar mais a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        await User.create(user)
            .then((user) => {
                //initialize session
                req.session.userid = user.id
                req.flash('message', 'Cadastro realizado com sucesso!')

                //salva sessão antes de redirecionar
                req.session.save(() => {
                    res.redirect('/')
                })

            })
            .catch((error) => console.log(error))

    }
}