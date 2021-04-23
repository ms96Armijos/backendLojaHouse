const express = require('express');
const router = express();

const { sendEmail, enviarCorreo, sendGridCorreo} = require('../controllers/correos.controllers');


router.post('/',sendGridCorreo);

module.exports = router;