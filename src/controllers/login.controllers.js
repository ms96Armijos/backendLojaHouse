const {mongo: {usuarioModel} } = require('../../databases');
let SEMILLA = require('../../config/index').SEMILLATOKEN;
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

module.exports = {

    login: (req, res) => {

      //console.log(req.body)
        const { correo, password} = req.body;

        if (correo.length <= 0 || correo === undefined || correo === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar su correo electrónico",
          });
        }
        if (password.length <= 0 || password === undefined || password === null) {
          return res.status(400).json({
            ok: false,
            mensaje: "Debe ingresar su contraseñan",
          });
        }
    
        usuarioModel.findOne({ correo: correo}, (err, usuarioDB) => {
    
            if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: 'Error al buscar usuario',
                  errors: err,
                });
              }
             
            if(!usuarioDB){
                    return res.status(400).json({
                      ok: false,
                      mensaje: 'Los datos ingresados están incorrectos',
                      errors: err
                    });
            }
            
    
            if(usuarioDB.estado === '0'){
              return res.status(400).json({
                ok: false,
                mensaje: 'Tu cuenta ha sido bloqueada, comunícate con el administrador para más información',
                errors: err,
              });
            }
    
            //DATOS QUE SE ENVIAN AL GENERAR EL TOKEN
            payload= {
              _id: usuarioDB._id,
              rol: usuarioDB.rol
              /*nombre: usuarioDB.nombre,
              apellido: usuarioDB.apellido,
              cedula: usuarioDB.cedula,
              movil: usuarioDB.movil,
              convencional: usuarioDB.convencional,
              correo: usuarioDB.correo,
              imagen: usuarioDB.imagen,
              estado: usuarioDB.estado,
              rol: usuarioDB.rol*/
            }
    
    
            if(!bcrypt.compareSync(password, usuarioDB.password)){
                    return res.status(400).json({
                      ok: false,
                      mensaje: 'Los datos ingresados están incorrectos',
                      errors: 'Verifica que los datos ingresados estén correctos',
                    });
            }
    
            usuarioDB.password='';
    
            //CREANDO UN TOKEN
    
            let tokenUsuario = jwt.sign({usuario: payload}, SEMILLA, {expiresIn: '12h'}); //DURACION DE 28800 = 8 HORAS EL TOKEN
            res.status(200).json({
                ok: true,
                mensaje: 'Login correcto',
                token: tokenUsuario,
                menu: obtenerMenu(payload.rol),
                //id: usuarioDB._id
              });
        });
    }
}

function obtenerMenu(ROL){

  let arrendadorAdministrador =  {
    titulo: 'Sección Arrendador',
    icono: 'mdi mdi-account',
    submenu: [
      { titulo: 'Arrendadores', url: '/arrendador-usuario' }
    ],
  };

  let arrendatarioAdministrador = {
    titulo: 'Sección Arrendatario',
    icono: 'mdi mdi-account-outline',
    submenu: [
      { titulo: ' Arrendatarios ', url: '/arrendatario-usuario' }
    ],
  };


  let menu1 =  {
    titulo: 'Arrendador',
    icono: 'mdi mdi-account',
    submenu: [
      { titulo: ' Dashboard', url: '/dashboard' },
      { titulo: ' Gestión de Inmuebles ', url: '/inmuebles' },
      { titulo: ' Gestión de Visitas ', url: '/visitas' },
      { titulo: ' Gestión de Contratos de Alquiler ', url: '/vercontrato' },
      { titulo: ' Alquilar Inmueble ', url: '/publicados' }
    ],
  };

  let menu2 = {
    titulo: 'Arrendatario',
    icono: 'mdi mdi-account-outline',
    submenu: [
      { titulo: ' Dashboard', url: '/dasharrendatario' },
      { titulo: ' Visitas solicitadas', url: '/visitas-arrendatario' },
      { titulo: ' Contratos de Alquiler ', url: '/contratoarrendatario' },
    ],
  };


  let menu3 = {
    titulo: 'Configuraciones',
    icono: 'mdi mdi-account-settings-variant',
    submenu: [
      //{ titulo: 'Usuarios', url: '/usuarios' },
      { titulo: 'Gestión de Servicios', url: '/servicios' },
      { titulo: 'Gestión Tipos de Inmueble', url: '/tipoinmueble' }
    ]
  };
  

  let menuMensajes = {
    titulo: 'Mensajes',
    icono: 'mdi mdi-message',
    submenu: [
      //{ titulo: 'Usuarios', url: '/usuarios' },
      { titulo: 'Gestión de Mensajes', url: '/mensajes' }
    ]
  };

  let menuDashboard = {
    titulo: 'Dashboard',
    icono: 'mdi mdi-view-dashboard',
    submenu:[
      { titulo: 'Dashboard', url: '/dashadmin' }
    ]
  };


  var menu = [];
  
  if(ROL === 'ADMINISTRADOR'){
    menu[0] = Object(menuDashboard);
    menu[1] = Object(arrendadorAdministrador);
    menu[2] = Object(arrendatarioAdministrador);
    menu[3] = Object(menuMensajes);
    menu[4] = Object(menu3);
  }
  if(ROL === 'ARRENDADOR'){
    menu[0] = Object(menu1);
  }
  if(ROL === 'ARRENDATARIO'){
    menu[0] = Object(menu2);
  }
 

  return menu;

}