import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CharacterCRUD } from "./character_crud.js";
import { CharacterSearch } from "./character_search.js";
import { CharacterFeatured } from "./character_featured.js";

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
	CharacterFeatured(app);
}

export default PCPRoutes;
