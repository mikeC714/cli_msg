require("dotenv").config();
const net = require("node:net");
const { TYPES } = require("../types.js");
const auth = require("./methods/auth.js");
const friends = require("./methods/friends.js");
const msg = require("./methods/messages.js");
const connection = require("./methods/connection.js");


function decode(buffer){
	const type = buffer.readUInt8(0)
	const length = buffer.readUInt16BE(1);
	const payload = JSON.parse(buffer.subArray(5, 5 + length).toString("utf-8"));
	return { type, payload };
}


const USERS = new Map();

const server = net.createServer((socket) => {
	console.log("Client Connected");
	socket.write("Whats'up Server.")

	socket.on('data', async (chunk) => {
		const { type, payload } = decode(chunk);
		switch(type){
			case TYPES.REGISTER:
				const user = await auth.register(payload)
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
			case TYPES.SAVE_MSGS:
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
			case TYPES.ACK:
				connection.ack();
			break;
			case TYPES.ERROR:
				connection.error();
			break;
			case TYPES.DISCONNECT:
				connection.disconnect();
			break;
		}
	})
	socket.on('end', () => console.log("client disconnected"));
}).listen(3000, () => console.log("Server online"));
