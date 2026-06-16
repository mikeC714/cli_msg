const { HEADER_SIZE, MAGIC } = require("../utils/types.js");

/**
 * ## encode
 *	THIS FUNCTION WILL TAKE TWO OBJECTS
 *	
 *	param {hex} type
 *	TYPE WILL BE SET WHEN FUNCTION IS CALLED
 *
 * 	param {Object} payload 
 *	PAYLOAD WILL BE CONVERTED TO A JSON STRING 
 *
 * 	return {Uint8array} [header, payload]
 */


function encode(type, payload){
	const jsonPayload = JSON.stringify(payload); 
	const payBuf = Buffer.from(jsonPayload);

	const header = Buffer.alloc(HEADER_SIZE);
	header.writeUint16BE(MAGIC, 0);
	header.writeUint8(type, 2);
	header.writeUint32BE(payBuf.length);
	
	const packet = Buffer.concat([header, payBuf]);
	return packet;
}

module.exports = {encode}
