const express = require('express');
const router = express();

const { sendEmail, enviarCorreo} = require('../controllers/correos.controllers');


router.post('/',enviarCorreo);

module.exports = router;