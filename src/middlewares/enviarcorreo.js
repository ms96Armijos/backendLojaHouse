const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();

module.exports = {
  enviar_mail: (req, res) => {

    let correo = req.params.correo;
    let mensaje = req.params.mensaje;

    const transporter = nodemailer.createTransport(sendgridTransport({
        auth: {
          api_key: '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'
        }
      }));

      
      let mailOptions = {
        to: correo,
        from: "corp.lojahouse@gmail.com",
        subject: "Probando sendGrid",
        html: `
      <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
        <tr height="200px">
          <td bgcolor="" width="600"px>
            <h1 style="color: #fff; text-align:center">Bienvenido</h1>
            <p style="color:#fff; text-align:center">
              <span style:"color: #e84393">Tu contraseña temporal es: ${mensaje}</span>
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
            ok: true
          })
        }
    });

  },
};
