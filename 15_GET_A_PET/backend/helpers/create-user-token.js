const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token = jwt.sign(
      // passa o que vai ser enviado junto com o token 
      {
        name: user.name,
        id: user._id,
      },
      "nossosecret"
    );
  
    // return token
    res.status(200).json({
      message: 'Você está autenticado!',
      token: token,
      userId: user._id,
    });
  };

module.exports = createUserToken;

//"nossosecret" //forma de deixar o token único, ideal colocar strings complexas precisa dela para descriptografar o token