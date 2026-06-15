const test = require("node:test");
const assert = require("node:assert");
const { Acc } = require("../acc.js");
const { MAGIC, TYPES } = require("../../types.js");


test.describe("Testing Accumulator", () => {
	const mockPayload = Buffer.from("Hello World!");
	
	test.it("should return {type, payload}",() => {
		const acc = new Acc();
		acc.on("data", ({ type, payload }) => {
			assert.strictEqual(type, TYPES.MSG);
			assert.deepStrictEqual(payload, mockPayload);
		});
		const length = mockPayload.length;
		const header = Buffer.alloc(7);
		header.writeUint16BE(MAGIC, 0);
		header.writeUint8(TYPES.MSG, 2);
		header.writeUint32BE(length, 3);

		const packet = Buffer.concat([header, mockPayload])
		acc.collect(packet);
	})
})


