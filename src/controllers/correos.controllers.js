const nodemailer = require("nodemailer");

//cuando me da error de registrarme en la pagina de OAuth debo ir a consola de google y publicar la aplicacion

module.exports = {
  sendEmail: (data, callback) => {
    //DESDE AQÍ EMPIEZA LA GENERACIÓN DE LA CONTRASEÑA Y EL ENVÍO DEL CORREO ELECTRÓNICO
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port:465,
      secure: true,
      // requireTLS: true,
      XOAuth2: {
        user: "corp.lojahouse@gmail.com", // Your gmail address. // Not @developer.gserviceaccount.com
        clientId:
          "1024007464269-9p1h8g9kh2rs29aehgis9osp2d4r5sq4.apps.googleusercontent.com",
        clientSecret: "fNtt9V8h5R9ALjI857hT6Nrp",
        refreshToken:
          "L9IrOQCPLWz7geEnT97EyuNpRJrRwmsnKpZ1x5q_B7BBQDoWmQO7auqt9Rez7uzjtPE6n9o",
      },
      /* auth: {
     type: "login",
     user: "corp.lojahouse@gmail.com",
     pass: "#$corporacioneslaness#$",
   },*/
      debug: true, // show debug output
      logger: true, // log information in console
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: "corp.lojahouse@gmail.com",
      to: "tiviarmijos@gmail.com",
      subject: "Hola",
      text: "data.htmlMessage",
    };
    transporter.sendMail(mailOptions, (err) => {
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
