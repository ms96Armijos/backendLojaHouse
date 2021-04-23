const Notification = require('../../notifications/notifications');

//VERIFICAR TOKEN DEL USUARIO
exports.enviarNotificacion = function(req, res, next){
  const data = {
    tokenId: "fZPNNYfBRCeVsHLQPom5e-:APA91bGK8lfvpVxJdoZcu3_3Un0iemfOv1exTFzA4bfkRBTkJd69IzdiK6P0YmZOmtPATqnYG4s2JrihUkK_yz9QPl7X2rDHO1mQik2zrsNsDC67_fdzV4c47HgelLnBOqvg7VT-Gb_Q",
    titulo: "Re:codigo",
    mensaje: "Message from Nodejs to One User"
}
    Notification.sendPushToOneUser(data)
}

