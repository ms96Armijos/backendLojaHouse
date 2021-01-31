const firebaseAdmin = require('firebase-admin');

function initFirebase(){
    const serviceAccount = require('../utils/testlojahouse-firebase-adminsdk-kb8ev-20bfe675cb.json');
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount)
    });
}

initFirebase();

function sendPushToOneUser( notification ){
    const message = {
        token: notification.tokenId,
        data:{
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendPushToTopic( notification ){
    const message = {
        topic: notification.topic,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

module.exports = {
    sendPushToOneUser,
    sendPushToTopic
}

function sendMessage ( message ){
    firebaseAdmin.messaging().send(message)
    .then((response) => {
        console.log('Mensaje enviado correctamente: ', message);
    })
    .catch((error) => {
        console.log('Erros al enviar mensaje: ', error);
    })
}