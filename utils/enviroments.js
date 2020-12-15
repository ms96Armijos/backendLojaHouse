module.exports = {

    validateRequiredEnvs:( requiredEnvs ) => {
        for (const requiredEnv of requiredEnvs) {
            if(!process.env[requiredEnv]){
                throw new Error(`${requiredEnv} no está definido en el archivo .env`);
            }
        }
    }
}