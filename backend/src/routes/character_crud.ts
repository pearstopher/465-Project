import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Char } from "../db/entities/Char";

export function CharacterRoutes(app: FastifyInstance) {
	// C = Create Character
	app.post<{ Body: { id: number; fName: string; lName: string; desc: string; hidden: boolean } }>(
		"/character",
		{
			onRequest: [app.authenticate],
		},
		async (req, reply) => {
			const { id, fName, lName, desc, hidden } = req.body;

			const fLower = fName.toLowerCase();
			const lLower: string = lName.toLowerCase();
			console.log(req.user.sub);

			try {
				const currentChar = await req.em.findOne(Char, { user: req.user.sub });
				console.log(currentChar);
				if (currentChar) {
					//need to finish setting up multiple characters
					return reply.status(500).send({ message: "User already has a character." });
				}

				const newChar = await req.em.create(Char, {
					id,
					fName: fLower,
					lName: lLower,
					desc,
					hidden,
					featured: false, // this probably shouldn't be required
					user: req.user.sub,
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

	// R = Read
	app.get<{ Params: { id: number } }>(
		"/character/:id",
		async (req: FastifyRequest, reply: FastifyReply) => {
			// @ts-ignore
			const { id } = req.params; // didn't want to just ignore this but it breaks the docs otherwise

			try {
				//Character ID is not publicly available
				//Hidden (direct link only) characters do not need to be excluded from this search method

				const foundChar = await req.em.findOne(Char, { id });
				if (foundChar) {
					console.log("Character search complete. Character found.");
					return reply.send(foundChar);
				} else {
					console.log("Character search complete. Character not found.");
					return reply.status(404).send({ message: "Character not found." });
				}
			} catch (err) {
				console.log("Failed to complete character search.", err.message);
				return reply.status(500).send({ message: err.message });
			}
		}
	);

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

	// U = Update
	// your name or ID will be verified and won't change so you cant update those
	// (you can delete your character and make a new one if you NEED to do this)
	app.put<{ Body: { id: number; desc: string; hidden: boolean } }>(
		"/character",
		async (req, reply) => {
			const { id, desc, hidden } = req.body;

			//noticed I can select specific fields here, just the ones I'm interested in. Cool!
			const charToChange = await req.em.findOne(Char, { id }, { fields: ["id", "desc", "hidden"] });
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
