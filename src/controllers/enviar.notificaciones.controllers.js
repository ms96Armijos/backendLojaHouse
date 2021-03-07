const Notification = require('../../notifications/notifications');
module.exports = {

    enviarUnaNotificacion: (req, res, next) => {
      const data = {
        tokenId: "ekV3E5IPRiqxfe8EePE8JL:APA91bFJ8_CFdeCoRshFvreu6unyK7hv_0EbZrzJrPPbavyaJgPDAtlkGtWsxBEQEKt0vMbIrBn8LQG3TP2tvlVVissnukBkhOo9BCOJJ8jy7C_yAssjeO9TKN3rVwUBEzxaRXTy96nm",
        titulo: "Mensaje one to one",
        mensaje: "A un user"
      }
      Notification.sendPushToOneUser(data);
      },

    enviarNotificacionesAMuchos: async(req, res) => {
      const data = {
        topic: "user",
        titulo: "Mensaje one to many",
        mensaje: "A muchos usuarios"
      }
      Notification.sendPushToTopic(data);
      },

    
}