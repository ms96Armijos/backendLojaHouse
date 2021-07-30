const getExpeditiusCache = require('express-expeditious');

const defaultOptions = {
    namespace: 'expresscache',
    defaultTtl: '15 minute',
    statusCodeExpires: {
        404: '5 minute',
        500: 0
    }
}

const cacheInit = getExpeditiusCache(defaultOptions)
module.exports = { cacheInit }