import "chai/register-should.js"; // Using Should style

import { test, teardown } from "tap";
import { faker } from "@faker-js/faker";
import app from "../src/app.js";

//making these names global so I can test creating users with them
//while also retaining the ability to update/delete the same user later
class FakeUser {
	id: number;
	fName: string;
	lName: string;
	desc: string;
	hidden: boolean;
	constructor() {
		this.id = faker.datatype.number({ min: 1000000, max: 9999999 });
		this.fName = faker.name.firstName().toLowerCase();
		this.lName = faker.name.lastName().toLowerCase();
		this.desc = faker.random.words(10);
		this.hidden = faker.datatype.boolean();
	}
}
const fakeUser1 = new FakeUser();
const fakeUser2 = new FakeUser();

//Test Character CR(S)UD

//S = Create

test("Create a new character with valid information", async () => {
	const payload = {
		id: fakeUser1.id,
		fName: fakeUser1.fName,
		lName: fakeUser1.lName,
		desc: fakeUser1.desc,
		hidden: fakeUser1.hidden,
	};
	const response = await app.inject({
		method: "POST",
		url: "/character",
		payload,
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.fName.should.equal(fakeUser1.fName);
});

test("Create a new character with invalid information", async () => {
	const payload = {
		id: "id", //just throwing something in to break it,
		fName: fakeUser2.fName,
		lName: fakeUser2.lName,
		desc: fakeUser2.desc,
		hidden: fakeUser2.hidden,
	};
	const response = await app.inject({
		method: "POST",
		url: "/character",
		payload,
	});

	response.statusCode.should.equal(500);
});

//S = Search

test("Search for a character that exists by name", async () => {
	const response = await app.inject({
		method: "SEARCH",
		url: "/search/ane-mora",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.length.should.equal(1);
});

test("Search for a character that does not exist by name", async () => {
	const response = await app.inject({
		method: "SEARCH",
		url: "/search/doesnt-exist",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.length.should.equal(0);
});

test("Search for multiple characters with the same name, by name", async () => {
	const response = await app.inject({
		method: "SEARCH",
		url: "/search/september-snow",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.length.should.equal(2);
});

test("Search for character that is hidden by name", async () => {
	const response = await app.inject({
		method: "SEARCH",
		url: "/search/winter-snow",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.length.should.equal(0);
});

//R - read

test("Search for character that exists by ID", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/character/42934531",
	});

	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.id.should.equal(42934531);
	rj.fName.should.equal("ane");
	rj.lName.should.equal("mora");
});

test("Search for character that does not exist by ID", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/character/42069",
	});

	response.statusCode.should.equal(404);
});

test("Search for character that exists but is hidden, by ID", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/character/45502893",
	});

	response.statusCode.should.not.equal(404);
	//you should be able to retrieve hidden characters by ID, just not by name
	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.fName.should.equal("winter");
	rj.lName.should.equal("snow");
});

// U = Update

// D = Delete

test("Delete a character which has beeen successfully added to the database", async () => {
	const payload = {
		id: fakeUser1.id,
	};
	const response = await app.inject({
		method: "DELETE",
		url: "/character",
		payload,
	});
	response.statusCode.should.equal(200);
	const rj = response.json();
	rj.fName.should.equal(fakeUser1.fName);
});
test("Delete a character which does not exist in the database", async () => {
	const payload = {
		id: fakeUser2.id,
	};
	const response = await app.inject({
		method: "DELETE",
		url: "/character",
		payload,
	});
	response.statusCode.should.equal(500);
});

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
