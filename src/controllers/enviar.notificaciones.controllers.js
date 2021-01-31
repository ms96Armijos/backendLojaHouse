const Notification = require('../../notifications/notifications');
module.exports = {

    enviarUnaNotificacion: (req, res, next) => {
      const data = {
        tokenId: "",
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