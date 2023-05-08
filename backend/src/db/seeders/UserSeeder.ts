import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Char } from "../entities/Char.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(Char, {
			name: "Spot",
			email: "email@email.com",
			petType: "Dog",
		});

		em.create(Char, {
			name: "Dogbert",
			email: "email2@email.com",
			petType: "Dog",
		});

		em.create(Char, {
			name: "Doglord",
			email: "email3@email.com",
			petType: "Dog",
		});

		em.create(Char, {
			name: "NotaDog",
			email: "email4@email.com",
			petType: "Cat",
		});
	}
}
