const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body



        //validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação precisam ser iguais' })
            return
        }

        //chek if user exists
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro email!' })
            return
        }

        //create a password
        const salt = await bcrypt.genSalt(12)//coloca 12 caracteres a mais na senha
        const passwordHash = await bcrypt.hash(password, salt)//gera senha criptografada


        //create user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {

        const { email, password } = req.body

        //validations campos preenchidos
        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        //chek if user exists
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail!!' })
            return
        }

        //check if password match
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({message: 'Senha inválida!'})
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {
        let currentUser

        console.log(req.headers.authorization)

        //local onde geralmente fica armazenado o token
        if(req.headers.authorization) {
           const token = getToken(req)
           //decodifica token
           const decoded = jwt.verify(token, "nossosecret")

           //extrair usuário a partir do token
           currentUser = await User.findById(decoded.id)

           //remove senha do usuário
           currentUser.password = undefined
        } else {//não veio token
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')
    
        if (!user) {
          res.status(422).json({ message: 'Usuário não encontrado!' })
          return
        }
    
        res.status(200).json({ user })
      }

      static async editUser(req, res) {

          const id = req.params.id

          //recupera token do usuário logado
          const token = getToken(req)
  
          //recupera usuário a partir do token
          const user = await getUserByToken(token)

        //check if user exists
        if(!user){
            res.status(422).json({
                message: 'Usuário não encontrado!'
            })
            return
        }

        const { name, email, phone, password, confirmpassword } = req.body

        //se existir imagem, vem pelo req.file
        if(req.file){
            //Como o multer é um middleware, ele é executado antes,
            //então, neste ponto, ele já alterou o nome da imagem na req.
            //Neste ponto, a imagem já tem um nome: 132135456486461.jpg
            user.image = req.file.filename
        }

        //validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        user.name = name

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' })
            return
        }

        //check if user exists
        const userExists = await User.findOne({email: email})

        //Verifica se email já está cadastrado para outro usuário
        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor, utilize outro e-mail!'})
        }
        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }
        user.phone = phone

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
            return
        }

        // //check if password match
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem' })
            return
        //change password   
        //Usuário enviou uma senha e as duas são iguais, ele quer alterar a senha 
        } else if(password === confirmpassword ) {
            //criar senha criptografada
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }

        try {
            //returns updated data
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                { $set: user },
                { new: true}
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
                data: updatedUser
            })
            
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
      }
}