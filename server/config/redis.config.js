const { Redis } = require("ioredis");

module.exports = {
	redisDB: new Redis({
		db: 0,
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASS,
		tls: {},
		retryStrategy(times){
			if(times > 3) return null;
			return times * 200;
		}
}),
	cache: new Redis({
		db: 1,
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASS,
		tls: {},
		retryStrategy(times){
			if(times > 3) return null;
			return times * 200;
		}

}),
	stream: new Redis({})
}
