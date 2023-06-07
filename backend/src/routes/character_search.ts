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
}
