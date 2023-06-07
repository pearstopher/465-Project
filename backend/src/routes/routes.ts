import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Char } from "../db/entities/Char.js";
import { CharacterCRUD } from "./character_crud.js";
import { CharacterSearch } from "./character_search.js";

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
		return "Welcome to Pears' Character Profiles backend.";
	});

	CharacterCRUD(app);
	CharacterSearch(app);

	// Has Character
	// Does authenticated user have a character or not?
	app.get(
		"/hasCharacter",
		{
			onRequest: [app.authenticate],
		},
		async (req, reply) => {
			try {
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

export default PCPRoutes;
