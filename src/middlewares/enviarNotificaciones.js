const Notification = require('../../notifications/notifications');

//VERIFICAR TOKEN DEL USUARIO
exports.enviarNotificacion = function(req, res, next){
  const data = {
    tokenId: "ekV3E5IPRiqxfe8EePE8JL:APA91bFJ8_CFdeCoRshFvreu6unyK7hv_0EbZrzJrPPbavyaJgPDAtlkGtWsxBEQEKt0vMbIrBn8LQG3TP2tvlVVissnukBkhOo9BCOJJ8jy7C_yAssjeO9TKN3rVwUBEzxaRXTy96nm",
    titulo: "Re:codigo",
    mensaje: "Message from Nodejs to One User"
}
    Notification.sendPushToOneUser(data)
}

