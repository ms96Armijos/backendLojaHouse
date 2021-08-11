const getExpeditiusCache = require('express-expeditious');

const defaultOptions = {
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    statusCodeExpires: {
        404: '1 minute',
        500: 0
    }
}

const cacheInit = getExpeditiusCache(defaultOptions)
module.exports = { cacheInit }