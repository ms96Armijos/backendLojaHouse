const nodemailer = require("nodemailer");
const XOAuth2 = require('xoauth2');
const sendgridTransport = require('nodemailer-sendgrid-transport');

//cuando me da error de registrarme en la pagina de OAuth debo ir a consola de google y publicar la aplicacion



module.exports = {
  sendEmail: (data, callback) => {
    //DESDE AQÍ EMPIEZA LA GENERACIÓN DE LA CONTRASEÑA Y EL ENVÍO DEL CORREO ELECTRÓNICO
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 587, false for other ports
      requireTLS: true,
      // requireTLS: true,
      auth: {XOAuth2: XOAuth2.createXOAuth2Generator({
        user: "corp.lojahouse@gmail.com", // Your gmail address. // Not @developer.gserviceaccount.com
        clientId:
          "1024007464269-9p1h8g9kh2rs29aehgis9osp2d4r5sq4.apps.googleusercontent.com",
        clientSecret: "Tsl0qj2FlEw-aExfhKlwAfe7",
        refreshToken:
          "1//04iDs1eYdWmgqCgYIARAAGAQSNwF-L9IrT_2ovew6gWyHlTafvmnuRa06dOInFXLEdd9WqICQPc7JG0UJTjCR7kTGhwcJjQK_jP4",
        accessToken:"ya29.a0AfH6SMBvMXtznbi-yb3qLS_dspngXqaieGfeT62M5iA_KXcJlZCixvGBoNnt_lJHlNyO8Ug88geCDqN2PXVnoYAETdJavCQs8Wl71SN0IEXiZ7z-y3jUMO-CuFYMzqgnARTzL0tXD8KLEGUAipELMxTVe77j_n-hyrY2E9YVfjA",
      })},
       /*auth: {
     user: "testplagios@gmail.com",
     pass: "plagios123",
   },*/
      debug: true, // show debug output
      logger: true, // log information in console
 
   
    });
    const mailOptions = {
      from: "Tivi <corp.lojahouse@gmail.com>",
      to: "testplagios@gmail.com",
      subject: "Hola",
      text: "data.fgdfgdfg",
    };
    transporter.sendMail(mailOptions, function(err){
      if (err) {
        return console.error(err);
      }
    });
  },

  enviarCorreo: (req, res) => {
    const {correo} = req.body;

    /*
      host, hace referencia al nombre o IP de tu servidor SMTP
      port, puerto asignado por el servidor SMTP para el envió de correos
      secure, esto se entiende mejor de la siguiente manera si usas https su valor debe ser true, de lo contrario false
      auth, es un JSON con los datos de autentificación  al servidor SMTP
      type, escribe login para acceder al servidor SMTP
      user, usuario registrado
      pass, contraseña del usuario registrado
    */

    /*crear un objeto transportador a través del siguiente método "createTransport". */

      let jConfig = {
        host:"smtp.gmail.com", 
        port:465, 
        secure: true, 
        auth:{ 
              type:"login", 
              user: 'tiviarmijos@gmail.com', 
            pass: "maicol1996" 
        }
        };


    console.log(correo)
    let min = 1111;
    let max = 9999;
    let code = Math.floor(Math.random()*(max-min)+min);

    /* 
    from, es el correo origen o el correo que esta enviando el email
    to, el destinatario quien debe recibir el correo
    subject, asunto del correo
    html, Nodemailer nos permite enviar un mensaje codificado en lenguaje HTML lo cual es muy útil en campañas de marketing
    */
    let mailOptions = {
      from: "<tiviarmijos@gmail.com>",//remitente
      to: correo,//destinatario
      subject: "Hola",//asunto del correo
      html:` 
           <div> 
           <p>Hola amigo</p> 
           <p>Esto es una prueba del vídeo</p> 
           <p>¿Cómo enviar correos eletrónicos con Nodemailer en NodeJS </p> 
           </div> `
    }

    let transporter = nodemailer.createTransport(jConfig);

    
    /*Este objeto crea una variable de transporte que se comunicara con el servidor SMTP y enviará el correo, por ejemplo: */
     transporter.sendMail(mailOptions, (err, info)=>{
      if(err){
        res.status(500).send({
          message: 'Hola, ha ocurrido un error en el server', 
          error: err
      });
      }else{
        res.status(200).send({
          codigo: code
        })
      }
      transporter.close();
    });
  },

  sendGridCorreo: (req, res) => {

    const transporter = nodemailer.createTransport(sendgridTransport({
      auth: {
        api_key: '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'
      }
    }));

    let mailOptions = {
      to: 'neversteeven@hotmail.com',
      from: "corp.lojahouse@gmail.com",
      subject: "Probando sendGrid",
      html: `
    <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
      <tr height="200px">
        <td bgcolor="" width="600"px>
          <h1 style="color: #fff; text-align:center">Bienvenido</h1>
          <p style="color:#fff; text-align:center">
            <span style:"color: #e84393">Tu contraseña temporal es: 123456</span>
          </p>
        </td>
      </tr>
  
      <tr bgcolor="#fff">
        <td style="text-align:center">
          <p style="color:#000"><a href="www.google.com">Inicia Sesión en LojaHouse</a></p>
        </td>
      </tr>
  
    </table>
    `
    }
 
    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        res.status(500).send({
          message: 'Hola, ha ocurrido un error en el server', 
          error: err
      });
      }else{
        res.status(200).send({
          codigo: mailOptions
        })
      }
  });

  }
};

/*const prepareToSendEmail = (user, subject, htmlMessage) => {
    user = {
      name: user.name,
      email: user.email,
      verification: user.verification
    }
    const data = {
      user,
      subject,
      htmlMessage
    }
    if (process.env.NODE_ENV === 'production') {
      sendEmail(data, (messageSent) =>
        messageSent
          ? console.log(`Email SENT to: ${user.email}`)
          : console.log(`Email FAILED to: ${user.email}`)
      )
    } else if (process.env.NODE_ENV === 'development') {
      console.log(data)
    }
  }

  module.exports = {
    /**
     * Checks User model if user with an specific email exists
     * @param {string} email - user email
     */
/*async emailExists(email) {
      return new Promise((resolve, reject) => {
        User.findOne(
          {
            email
          },
          (err, item) => {
            itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
            resolve(false)
          }
        )
      })
    },*/

/**
 * Checks User model if user with an specific email exists but excluding user id
 * @param {string} id - user id
 * @param {string} email - user email
 */
/* async emailExistsExcludingMyself(id, email) {
      return new Promise((resolve, reject) => {
        User.findOne(
          {
            email,
            _id: {
              $ne: id
            }
          },
          (err, item) => {
            itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
            resolve(false)
          }
        )
      })
    },*/

/**
 * Sends registration email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
/* async sendRegistrationEmailMessage(locale, user) {
      i18n.setLocale(locale)
      const subject = i18n.__('registration.SUBJECT')
      const htmlMessage = i18n.__(
        'registration.MESSAGE',
        user.name,
        process.env.FRONTEND_URL,
        user.verification
      )
      prepareToSendEmail(user, subject, htmlMessage)
    },*/

/**
 * Sends reset password email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
/*async sendResetPasswordEmailMessage(locale, user) {
      i18n.setLocale(locale)
      const subject = i18n.__('forgotPassword.SUBJECT')
      const htmlMessage = i18n.__(
        'forgotPassword.MESSAGE',
        user.email,
        process.env.FRONTEND_URL,
        user.verification
      )
      prepareToSendEmail(user, subject, htmlMessage)
    }
  }*/
