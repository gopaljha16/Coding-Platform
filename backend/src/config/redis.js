const redis = require("redis");

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_STRING,
        port: process.env.REDIS_PORT_NO
    }
})

module.exports = redisClient;