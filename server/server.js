require("dotenv").config();
const net = require("node:net");
const { TYPES } = require("../types.js");
const auth = require("./methods/auth.js");
const friends = require("./methods/friends.js");
const msg = require("./methods/messages.js");
const connection = require("./methods/connection.js");
const { Acc } = require("./acc.js");

const USERS = new Map();


/**
 * TYPES {Object} -> {hex}
 * JAVASCRIPT CONVERTS HEX TO BASE 10 ALLOWING FOR 0x02 === 2 to be true
 *
 *	ONCE THE SOCKET EVENT data TRIGGERS THE SOCKET RETUNRS A CHUNK
 *	THAT CHUNK IS THEN PASSED TO THE ACCUMULATOR TO PREVENT POSSIBLE ERRORS 
 *	SUCH AS DATA TRUNCATION
 */



const server = net.createServer((socket) => {
	let user;
	socket.on('data', (chunk) => Acc.collect(chunk));
	socket.on('connect', () => socket.write(`${user} is now online.`));
	socket.on('end', () => console.log("client disconnected"));



	/**
	 * @callback
	 *
	 * @param {number} type
	 *	type represents the action being done by user
	 *
	 * @param {Object} payload 
	 *	payload is an object that contains data based on the action being invoked
	 *	payload {
	 *		to? - when the user is sending a message, or friend request
	 *		roomId? - when the user is sending a message to a group larger than 3 (user + 2 people)
	 *		body - the body is the main content that differs depending on what method is being called. But the shape will always be an Object
	 *	}
	*/

		Acc.on('payload', async ({type, payload}) => {
			switch(type){
				case TYPES.REGISTER:
					user = await auth.register(payload)
					USERS.set(user, socket);				
				break;
				case TYPES.LOGIN: 
					const username = await auth.login(payload);
					USERS.set(username, socket);
				break;
				case TYPES.MSG:
					msg.send(payload, USERS)
				break;
				case TYPES.GET_MSGS:
					msg.get(payload)
				break;
				case TYPES.SAVE_MSG:
					msg.save(payload)
				break;
				case TYPES.DELETE_MSG: 
					await msg.delete(payload)
				break;
				case TYPES.ADD_FRIEND:
					await friends.addFriend(payload);
				break;
				case TYPES.BLOCK_FRIEND: 
					await friends.blockFriend(payload);
				break;
				case TYPES.LIST_FRIENDS:
					await friends.listFriends(payload);
				break;
				case TYPES.ERROR:
					connection.error();
				break;
				case TYPES.DISCONNECT:
					connection.disconnect();
				break;
			}
		})
	}).listen(3000, () => console.log("server online"))
