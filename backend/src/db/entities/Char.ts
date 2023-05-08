import { Entity, Property, Unique, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

@Entity({ tableName: "characters" })
export class Char extends BaseEntity {
	@Property()
	fName!: string;

	@Property()
	lName!: string;

	// there does not need to be a description
	@Property({ nullable: true })
	desc?: string;

	// if hidden will not display in public search results
	@Property()
	hidden!: boolean;
}
