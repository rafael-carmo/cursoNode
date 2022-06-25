
//models
const Pet = require('../models/Pet')

//helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
    static async create(req, res) {

        const { name, age, weight, color } = req.body

        //Um pet deve está disponivel na criação
        const available = true

        //images upload
        const images = req.files

        //validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória!' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório!' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória!' })
            return
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória!' })
            return
        }

        //obtem o dono do pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: "Pet cadastrado com sucesso!",
                newPet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }


    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            message: "Deu certo!",
            pets
        })
        return
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        console.log(token)
        console.log(user)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        console.log(pets)

        res.status(200).json({ pets })
        return
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })
        return
    }

    static async getPetById(req, res) {
        const id = req.params.id

        //check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido!' })
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        res.status(200).json({
            message: 'Pet encontrado com sucesso!',
            pet
        })
    }

    static async removePetById(req, res) {
        //id do pet
        const id = req.params.id

        //check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido!' })
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        //recupera usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)

        //está tentando deletar um pet que não é seu
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Você não tem permissão para remover este pet!' })
            return
        }

        await Pet.findByIdAndRemove(id)
        res.status(200).json({ message: 'Pet removido com sucesso!' })
    }


    static async updatePet(req, res) {
        //id do pet
        const id = req.params.id

        //check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido!' })
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        //recupera usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)

        //está tentando editar um pet que não é seu
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Você não tem permissão para atualizar este pet!' })
            return
        }

        const { name, age, weight, color, available } = req.body

        //images upload
        const images = req.files

        const updatedData = {}

        //validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        updatedData.name = name

        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória!' })
            return
        }
        updatedData.age = age

        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório!' })
            return
        }
        updatedData.weight = weight

        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória!' })
            return
        }
        updatedData.color = color

        if (!available) {
            res.status(422).json({ message: 'A disponibilidade é obrigatória!' })
            return
        }
        updatedData.available = available

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória!' })
            return
        }
        updatedData.images = []

        images.map((image) => {
            updatedData.images.push(image.filename)
        })

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({
            message: 'Pet atualizado com sucesso!',
            pet: pet,
            updatedData
        })

    }


    static async schedule(req, res) {
        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        //recupera usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)

        //está tentando adotar seu próprio pet
        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não agendar uma visita para seu próprio pet!' })
            return
        }

        // check if user has already adopted this pet
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({
                    message: 'Você já agendou uma visita para este Pet!',
                })
                return
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} no telefone: ${pet.user.phone}`,
            pet
        })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        //recupera usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Você não tem permissão para atualizar este pet!' })
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(pet._id, pet)

        res.status(200).json({
            pet,
            message: `Parabéns! O ciclo de adoção foi finalizado com sucesso!`,
        })

    }
}