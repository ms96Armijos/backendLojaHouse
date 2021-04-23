module.exports = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    SEMILLATOKEN: '@loja$house#token@',
    EXPRESIONEMAIL: new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
};