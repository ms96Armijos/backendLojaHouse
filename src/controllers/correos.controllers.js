const nodemailer = require("nodemailer");
const XOAuth2 = require('xoauth2');

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
