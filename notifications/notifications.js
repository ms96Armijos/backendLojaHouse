const firebaseAdmin = require('firebase-admin');

function initFirebase(){
    const serviceAccount = require('../utils/lhproyecto-86325-firebase-adminsdk-ya2lr-b2d78d8233.json');
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount)
    });
}

initFirebase();

function sendPushToOneUser( notification ){
    const message = {
        token: notification.tokenId,
        notification:{
            title: notification.titulo,
            body: notification.mensaje,
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
        console.log('Mensaje enviado correctamente: ', message)
    })
    .catch((error) => {
        console.log('Erros al enviar mensaje: ', error);
    })
}
/*const admin = require("firebase-admin");

const serviceAccount = require("../utils/notificationstesis-firebase-adminsdk-b8kxs-5124cfd1eb.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging()
    var payload = {
        token: 'ekV3E5IPRiqxfe8EePE8JL:APA91bFJ8_CFdeCoRshFvreu6unyK7hv_0EbZrzJrPPbavyaJgPDAtlkGtWsxBEQEKt0vMbIrBn8LQG3TP2tvlVVissnukBkhOo9BCOJJ8jy7C_yAssjeO9TKN3rVwUBEzxaRXTy96nm',
        notification: {
            title: "This is a Notification",
            body: "This is the body of the notification message."
        },
        };


    messaging.send(payload)
    .then((result) => {
        console.log(result)
    })*/
