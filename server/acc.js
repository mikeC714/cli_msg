const EventEmitter = require("node:events");
const { MAGIC, HEADER_SIZE } = require("../types.js");

export default class Acc extends EventEmitter{
	constructor(){
		super();
		this.buffer = Buffer.alloc(0);
	}

	/**
	 * THE ACCUMULATOR
	 * CONCATENATES THE CURRENT BUFFER STATE WITH THE ADDED CHUNKS
	 * CALLING PROCESS TO THEN VERIFY THE BUFFER IS FULL
	 */

	collect(chunk){
		this.buffer = Buffer.concat([this.buffer, chunk]);
		this.process();
	}

	/**
	 * THIS FUNCTION IS CALLED INORDER TO PROCESS CHUNKS WHEN LENGTH IS MET
	 * TO PREVENT ANY HICCUPS THE PAYLOAD BUFFER LENGTH IS COMPARED TO VERIFY THAT IT'S FULL BEFORE
	 * PROCESSING AND PASSED TO BE PARSED
	 */

	process(){
		while(true){
			if(this.buffer.length < HEADER_SIZE) break;

			const magic = this.buffer.readInt16BE(0);
			if(magic !== MAGIC){
				this.emit('error', new Error("The magic ain't magicing"));
				this.buffer = Buffer.alloc(0);
				break;
			}

			const type = this.buffer.readUint8(2);
			const payloadLength = this.buffer.readUint32BE(3);
		
			const neededLength = HEADER_SIZE + payloadLength;

			if(this.buffer.length < neededLength) break;
			
			const payload = this.buffer.subarray(7, neededLength);
			this.buffer = this.buffer.subarray(neededLength);

			this.parse(payload, type);
		}
	}

	/**
	 * param {Unit8Array} payload
	 * param {Unit8Array} type
	 * return -> {Object} -> {string, object} type, payload 
	 */

	parse(payload, type){
		payload = payload.toString('utf-8');
		try{
			payload = JSON.parse(payload);
			return{type, payload}
		}catch(err){

		}
	}
}
