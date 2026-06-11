const { db } = require("../config/postgresql.config.js");


/**
 * Represents all methods involving user's friends
 * @Object
 */

export default{
////////////
/// TODO ///
///////////
/**
 * UNBLOCK FUNCTION
 */



	/**
	 * @param {string} user_id
	 * @param {string} friend_id
	 */

	async addFriend({ user_id, username }){
		try{
			const results = await db.query(
			`WITH found_user AS(
				SELECT id FROM users WHERE username = $1
			),
			inserted AS(
			INSERT INTO friends(user_id, friend_id, status)
			SELECT $2, id, 'pending' 
			FROM found_user
			RETURNING status
			)
			SELECT inserted.status, found_user.username
			FROM inserted
			JOIN found_user ON found_user.id = inserted.friend_id
			`,[username, user_id]
			)
			return results.rows[0];
		}catch(err){
			throw err;
		}
	},

	/**
	 * @param {string} user_id
	 * @param {string} blocked_id
	 */
	async blockFriend({ user_id, username }){
		try{
			const results = await db.query(
			`WITH found_user AS(
				SELECT id, username FROM users WHERE username = $1
			),
			updated AS(
				UPDATE friends
				SET status = 'blocked'::friend_status
				WHERE user_id = $2
				AND friend_id = (SELECT id FROM found_user)
				RETURNING friend_id, status
			)
			SELECT updated.status, found_user.username
			FROM updated
			JOIN found_user ON found_user.id = updated.friend_id
			`,[user_id, username]
			);

			return results.rows[0];
		}catch(err){
			throw err;
		}
	},

	/**
	 * @param {string} user_id
	 */
	async listFriends({ user_id }){
		try{
			const results = await db.query(
				`SELECT u.id, u.username
				FROM friends f
				JOIN user u ON u.id = f.friend_id
				WHERE f.user_id = $1
				AND f.status = 'accepted'
				`,[user_id]
			)
			if(!results.rows.length) return friends = [];
			return friends = results.rows;
		}catch(err){
			throw err;
		}	
	},
}


