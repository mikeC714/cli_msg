const Pool = require("pg-pool");


export const db = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: 'messenger',
	ssl: true
})
