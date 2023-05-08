import "chai/register-should.js"; // Using Should style

import { test, teardown } from "tap";
import { faker } from "@faker-js/faker";
import app from "../src/app.js";

test("Search for a character that exists by name", async () => {
	const response = await app.inject({
		method: "SEARCH",
		url: "/search/winter-snow",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.length.should.equal(1);
	//response.body.should.equal("hello");
});

// test("List all users from /dbTest", async () => {
// 	const response = await app.inject({
// 		method: "GET",
// 		url: "/dbTest",
// 	});
//
// 	response.statusCode.should.equal(200);
// });

// test("Creating a new user", async () => {
// 	const payload = {
// 		name: "Testname",
// 		email: faker.internet.email(),
// 		petType: "Dog",
// 	};
//
// 	const response = await app.inject({
// 		method: "POST",
// 		url: "/users",
// 		payload,
// 	});
//
// 	response.statusCode.should.equal(200);
// 	response.payload.should.not.equal(payload);
// 	const resPayload = response.json();
// 	resPayload.email.should.equal(payload.email);
// 	resPayload.petType.should.equal("Dog");
// });

teardown(() => app.close());
