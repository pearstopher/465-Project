import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Char } from "./db/entities/Char.js";
import { ICreateUsersBody } from "./types.js";

/** This function creates all backend routes for the site
 *
 * @param {FastifyInstance} app - The base Fastify listen server instance
 * @param {{}} _options - Fastify instance options (Optional)
 * @returns {Promise<void>} - Returns all of the initialized routes
 */
async function PCPRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	// HOME ROUTE
	// This is the landing page you get when you visit the site.
	app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		return "Welcome to Pears' Character Profiles";
	});

	// SEARCH ROUTES
	// this is the route for searching for characters by NAME
	// right now I'm going to search for emails to test it
	app.search<{ Params: { fName: string; lName: string } }>(
		"/search/:fName-:lName",
		async (req: FastifyRequest, reply: FastifyReply) => {
			let { fName, lName } = req.params;

			try {
				// in my browser URLs are always lowercase. need to test and see if this actually breaks/is necessary
				fName = fName.toLowerCase();
				lName = lName.toLowerCase();

				//1. Note that character names are not unique, this could return multiple characters
				//2. Notice that private characters are hidden from the search results
				const foundChars = await req.em.find(Char, { fName, lName, hidden: false });

				console.log("Character search complete. " + foundChars.length + " character(s) found.");
				return reply.send(foundChars);
			} catch (err) {
				console.log("Failed to complete character search.", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);

	app.search<{ Params: { id: number } }>(
		"/search/:id",
		async (req: FastifyRequest, reply: FastifyReply) => {
			const { id } = req.params;

			try {
				//Character ID is not publicly available
				//Hidden (direct link only) characters do not need to be excluded from this search method

				const foundChar = await req.em.findOne(Char, { id });
				const not: string = foundChar ? "" : "not ";
				console.log("Character search complete. Character " + not + "found.");
				return reply.send(foundChar);
			} catch (err) {
				console.log("Failed to complete character search.", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);

	// USER PROFILE

	// USER CHARACTERS

	// C = Create Character
	app.post<{ Body: { id: number; fName: string; lName: string; hidden: boolean } }>(
		"/character",
		async (req, reply) => {
			const { id, fName, lName, hidden } = req.body;

			try {
				const newChar = await req.em.create(Char, {
					id,
					fName,
					lName,
				});

				await req.em.flush();

				console.log("Created new character:", newChar);
				return reply.send(newChar);
			} catch (err) {
				console.log("Failed to create new user", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);

	//READ
	// (find a character by their name)
	app.search<{ Body: { fName: string; lName: string } }>("/character", async (req, reply) => {
		const { fName, lName } = req.body;

		try {
			const theChar = await req.em.findOne(Char, { fName, lName });
			console.log(theChar);
			reply.send(theChar);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// UPDATE
	// your name or ID will be verified and won't change so you cant update those
	// (you can delete your character and make a new one if you NEED to do this)
	app.put<{ Body: { id: number; desc: string; hidden: boolean } }>(
		"/character",
		async (req, reply) => {
			const { id, desc, hidden } = req.body;

			const charToChange = await req.em.findOne(Char, { id });
			charToChange.desc = desc;
			charToChange.hidden = hidden;

			// Reminder -- this is how we persist our JS object changes to the database itself
			await req.em.flush();
			console.log(charToChange);
			reply.send(charToChange);
		}
	);

	// DELETE
	app.delete<{ Body: { id: number } }>("/character", async (req, reply) => {
		const { id } = req.body;

		try {
			const theChar = await req.em.findOne(Char, { id });

			await req.em.remove(theChar).flush();
			console.log(theChar);
			reply.send(theChar);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
}

export default PCPRoutes;
