//import dos pacotes necessários
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

//inicializa express
const app = express()

const conn = require('./db/conn')

//Models
const Tought = require('./models/Tought')

//Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Import Controller
const ToughtController = require('./controllers/ToughtController')
const AuthController = require('./controllers/AuthController')

//configurações da template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Para receber resposta do body
//Para conseguir extrair quando vier requisição do formulário
app.use(
    express.urlencoded({
        extended: true
    })
)

//Receber os dados em json
app.use(express.json())

//Configurações do session middleware
//session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false, //ao cair a sessão desconecta
        saveUninitialized: false,
        //onde a sessão será salva
        store: new FileStore({
            //Necessário ter essa função de log, mas não precisa escrever nela
            logFn: function(){} ,

            //caminho para a pasta onde serão salvos os arquivos de sessão dos usuário (ficará na pasta sessions)
            path: require('path').join(require('os').tmpdir(),'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000, //tempo de duração (1 dia)
            expires: new Date(Date.now() + 3600000),//força a expiração em algum tempo (1 dia por exemplo)
            httpOnly: true, //como não tem certificado de sergurança, está usando apenas http. Caso o site tenha certificado de segurança, então teria que usar https
        },
    }),
)

//flash messages: mensagens de status do sistema
app.use(flash())

//public path para os assets do projeto (css, imagens, etc)
app.use(express.static('public'))

//salvar a sessão da resposta 
//serve para dar andamento no sistema ou não, dependendo do que queira fazer, por exemplo: continua logado? segue para próxima etapa
app.use((req, res, next) => {
    console.log(req.session.userid)

    //verifica se o usuário tem sessão
    if(req.session.userid){
        //para garantir que tem o id da sessão do usuário em todas as respostas (res)
        //pega a sessão da requisição e coloca na resposta
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.get('/', ToughtController.showToughts)

conn
// .sync({force: true})
.sync()
.then(()=>{
    app.listen(3000)
})
.catch((err)=> console.log(err))