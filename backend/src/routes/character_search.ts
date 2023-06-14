import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Char } from "../db/entities/Char.js";

export function CharacterSearch(app: FastifyInstance) {
	// S = Search
	app.search<{ Params: { fName: string; lName: string } }>(
		"/search/:fName-:lName",
		async (req: FastifyRequest, reply: FastifyReply) => {
			// @ts-ignore
			let { fName, lName } = req.params; // didn't want to ignore these but it breaks generating the docs

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

	// Has Character
	// Does authenticated user have a character or not?
	app.get(
		"/hasCharacter",
		{
			onRequest: [app.authenticate],
		},
		async (req, reply) => {
			try {
				//@ts-ignore
				const currentChar = await req.em.findOne(Char, { user: req.user.sub });
				console.log(currentChar);
				if (currentChar) {
					//need to finish setting up multiple characters
					return reply.send({ exists: true, id: currentChar.id });
				} else {
					return reply.send({ exists: false, id: 0 });
				}
			} catch (err) {
				console.log("Error checking for character.", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);

	// Has Characters
	// Updated version of HasCharacter which returns all the user's characters instead of just one
	app.get(
		"/hasCharacters",
		{
			onRequest: [app.authenticate],
		},
		async (req, reply) => {
			try {
				//@ts-ignore
				const currentChars = await req.em.find(Char, { user: req.user.sub });
				console.log(currentChars);
				//make a list of all the character ids
				if (currentChars) {
					const ids = [];
					currentChars.forEach((currentChar) => {
						ids.push(currentChar.id);
					});

					//need to finish setting up multiple characters
					return reply.send({ exists: true, ids: ids });
				} else {
					return reply.send({ exists: false, ids: 0 });
				}
			} catch (err) {
				console.log("Error checking for character.", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);
}
