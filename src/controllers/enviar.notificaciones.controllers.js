const Notification = require('../../notifications/notifications');
const { mongo: { usuarioModel, inmuebleModel } } = require("../../databases");
module.exports = {

    enviarUnaNotificacion: async(req, res, next) => {

      let _id = req.params.idInmueble;

      const inmueble = await inmuebleModel.findById(_id);
      console.log(inmueble.nombre)

      await usuarioModel
      .find({ rol: { $in: 'ARRENDATARIO' }}, "tokenfirebase")
      .exec((err, usuarios) => {
        
        for (let i = 0; i < usuarios.length; i++) {
          const element = usuarios[i].tokenfirebase;
          if(element){
            console.log('hola: '+element)
            const data = {
              //tokenId: "fZPNNYfBRCeVsHLQPom5e-:APA91bGK8lfvpVxJdoZcu3_3Un0iemfOv1exTFzA4bfkRBTkJd69IzdiK6P0YmZOmtPATqnYG4s2JrihUkK_yz9QPl7X2rDHO1mQik2zrsNsDC67_fdzV4c47HgelLnBOqvg7VT-Gb_Q",
              tokenId: element,
              titulo: "Se ha publicado un inmueble en LojaHouse",
              mensaje: inmueble.nombre + '\n' + inmueble.descripcion,
            }
            Notification.sendPushToOneUser(data);
          
          }
        }
        res.status(200).json({
          ok: true,
        });
      })
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