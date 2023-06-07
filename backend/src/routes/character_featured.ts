import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Char } from "../db/entities/Char.js";

export function CharacterFeatured(app: FastifyInstance) {
	// FEATURED CHARACTERS

	// featured characters require elevated privileges to create
	// I'm just adding "get" for now, will add set/update after I learn how to authenticate in class
	app.get("/featured/", async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			//Character ID is not publicly available
			//Hidden (direct link only) characters do not need to be excluded from this search method

			const featuredChars = await req.em.find(Char, { featured: true });
			if (featuredChars) {
				console.log("Retrieved featured characters.");
				return reply.send(featuredChars);
			} else {
				console.log("Featured characters do not exist.");
				// this isn't a 404, we didn't *not find anything*, we just found an empty list
				return reply.send({ message: "No featured characters found." });
			}
		} catch (err) {
			console.log("Failed to complete character search.", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});
}
