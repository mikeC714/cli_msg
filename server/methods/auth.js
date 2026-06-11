const { db } = require("../config/postgresql.config.js");
const bcyrpt = require("bcrypt"); 


export const USERS = new Map();

export default{
	//////////
	///TODO///
	/////////

	/**
	 * ADD DELETE USER FUNCTION
	 * /


	/**
	 * @param {string} username
	 * @param {string} password
	*/
	async register({ username, password }){
		const rounds = 10;
		try{
			const salt = await bcrypt.genSalt(rounds);
			const safe = await bcrypt.hash(password, salt);
			
			const results = await db.query(
				`INSERT INTO users(username, password) 
				VALUES($1, $2)
				RETURN username
			 	`,[username, safe]
			);
			return results.rows[0].username;
		}catch(err){
			throw err;
		}
	},
	/**
	 * @param {string} username
	 * @param {char} password
	 */

	async login({ username, password }){
		try{	
			const results = await db.query(
				`SELECT 
					username,
					password
				WHERE username = $1
			`,[username]
			);
			const valid = await bcyrpt.compare(password, results.rows[0].password);
			if(!valid) throw new Error("Invalid credentials");
			return results.rows[0].username;
		}catch(err){
			throw err;
		}
	}
}
