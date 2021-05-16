require('dotenv').config();

//Nested estructuring (revisar ese concepto)
const { enviromentUtils: { validateRequiredEnvs } } = require('./utils');
const requiredEnvs = ['PORT', 'MONGO_URI'];
const { mongoDBHelpers } = require('./helpers');
const mongodb = require('./helpers/mongodb');
validateRequiredEnvs(requiredEnvs);


//función autoejecutable asíncrona

(async () => {
    await mongoDBHelpers.conectar();
    require('./server');
})();


process.on('SIGINT', () => {
    mongodb.desconectarBD().then((estadoConexion) => {
        console.log('Base de datos desconectada, estado de la conexión: '+estadoConexion);
        console.log('cerrando conexión');
        process.exit(0);
    });
})


//REEMPLAZAR EN EL ARCHIVO .ENV PARA BASE DE DATOS REMOTA
/*MONGO_URI=mongodb+srv://plagios123:plagios123@cluster0.x5gj7.mongodb.net/lojahouse?retryWrites=true&w=majority */