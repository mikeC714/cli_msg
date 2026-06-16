const test = require("node:test");
const assert = require("assert");
const { encode } = require("../utils/encode.js");

test.describe("Testing Encoding", () => {
	const mockType = 0x02;
	const mockPayload = {name: "Jon", lastName: "Doe"};

	test.it("Encode the given data and return packet", () => {
		const packet = encode(mockType, mockPayload)
		assert.equal(packet instanceof Uint8Array, true);
	})
})
