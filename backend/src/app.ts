import Fastify from "fastify";
import config from "./db/mikro-orm.config.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import PCPRoutes from "./routes.js";
import cors from "@fastify/cors";

const app = Fastify();

await app.register(cors, {
	//had to add this and allow our custom "search" method
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "SEARCH"],
});

await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);

await app.register(PCPRoutes);

export default app;
