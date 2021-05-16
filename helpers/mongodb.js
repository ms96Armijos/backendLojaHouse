const mongoose = require('mongoose');
const { mongoURI } = require('../config');
mongoose.set('useCreateIndex', true); 





const verificarConexion = () =>{
    //READYSTATE PARA VER EL ESTADO DE LA BD
    return mongoose.connection.readyState;
};

const conectar = async() => {
    try {
        if(!verificarConexion()){
          console.log('conectándose a la BD')
          await mongoose.connect('mongodb://plagios123:plagios123@cluster0.x5gj7.mongodb.net/lojahouse?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
        }
        console.log("Base de datos: \x1b[32m%s\x1b[0m","online")
    } catch (error) {
        console.error(error);
    }
}

const desconectarBD = async() => {
    await mongoose.connection.close();
    return verificarConexion();
}


module.exports = { verificarConexion, conectar, desconectarBD };  