const express = require('express');
const router = express();

const { sendEmail} = require('../controllers/correos.controllers');


router.post('/',sendEmail);

module.exports = router;