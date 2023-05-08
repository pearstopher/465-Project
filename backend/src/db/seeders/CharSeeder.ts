import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Char } from "../entities/Char.js";

export class CharSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(Char, {
			id: 42934531,
			fName: "Ane",
			lName: "Mora",
			desc: "This is an (optional) character description.",
			hidden: false,
		});

		em.create(Char, {
			id: 45151669,
			fName: "September",
			lName: "Snow",
			desc: "This is an (optional) character description.",
			hidden: true,
		});

		em.create(Char, {
			id: 45502893,
			fName: "Winter",
			lName: "Snow",
			hidden: false,
		});
	}
}
