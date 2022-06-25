const multer = require('multer')
const path = require('path')

//Destination to store the images
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {//local onde será salvo
        let folder = ""
        
        //como salva imagens de objetos diferentes (usuários e pets)
        //verificar primeiro qual caminho veio na url
        if(req.baseUrl.includes('users')){
            folder = 'users'
        } else if(req.baseUrl.includes('pets')){
            folder = 'pets'
        }
        cb(null, `public/images/${folder}`) //caminho para o multer salvar as images
    }, 
    filename: function name(req, file, cb) { //nome do arquivo depois de salvo
        
        //o nome do arquivo vai virar a data atual em milisegundos concatenado com a extensão do arquivo
        //para evitar que as imagens tenham o mesmo nome
        //vai gerar uma imagem com o nome 23134564156456456.jpg
        cb(null, Date.now() + String(Math.floor(Math.random()*1000)) + path.extname(file.originalname))
        
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {//filtra quais arquivos receber
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Por favor, envie apenas jpg ou png!'))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload}