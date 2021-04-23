const Boom = require('@hapi/boom');

module.exports = (schema) => {
    return async (req, res, next) => {
        try{
            await schema.validateAsync(req.body);
            next();
        } catch(error){
            console.log('ok ')
            //res.send(Boom.badData());
            return res.status(400).json({
                ok: false,
                mensaje: error.message,
              });
        }
    }
}