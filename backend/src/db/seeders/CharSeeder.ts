import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Char } from "../entities/Char.js";

export class CharSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(Char, {
			id: 42934531,
			fName: "ane",
			lName: "mora",
			desc: "This is an (optional) character description.",
			hidden: false,
			featured: true,
		});

		em.create(Char, {
			id: 45151669,
			fName: "september",
			lName: "snow",
			desc: "This is an (optional) character description.",
			hidden: false,
			featured: true,
		});

		em.create(Char, {
			id: 22573667,
			fName: "september",
			lName: "snow",
			desc: "This is not my character, it's just somebody with the same name as one of my characters.",
			hidden: false,
			featured: false,
		});

		em.create(Char, {
			id: 45502893,
			fName: "winter",
			lName: "snow",
			hidden: true,
			featured: false,
		});
	}
}
