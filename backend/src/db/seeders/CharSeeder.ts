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
			user: "twitter|1307071176376594432",
		});

		em.create(Char, {
			id: 45151669,
			fName: "september",
			lName: "snow",
			desc: "This is an (optional) character description.",
			hidden: false,
			featured: true,
			user: "twitter|1307071176376594432",
		});

		em.create(Char, {
			id: 22573667,
			fName: "september",
			lName: "snow",
			desc: "This is not my character, it's just somebody with the same name as one of my characters.",
			hidden: false,
			featured: false,
			user: "twitter|1307071176376594432",
		});

		em.create(Char, {
			id: 45502893,
			fName: "winter",
			lName: "snow",
			hidden: true,
			featured: false,
			user: "twitter|1307071176376594432",
		});

		em.create(Char, {
			id: 43596225,
			fName: "miss",
			lName: "hakuri",
			hidden: false,
			featured: true,
			avatar:
				"https://img2.finalfantasyxiv.com/f/641d0a0ddfdc1d3da7aaa91ce9b1e055_fce4949e615393e574f2d57134b31fc1fc0_96x96.jpg?1684363681",
			user: "twitter|1307071176376594432",
		});
	}
}
