const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
	fastify.register(require("@fastify/jwt"), {
		domain: process.env.AUTH_DOMAIN,
		secret: process.env.AUTH_SECRET,
	});

	fastify.decorate("authenticate", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});
});
