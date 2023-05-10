import { Migration } from "@mikro-orm/migrations";

export class Migration20230508183229 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "characters" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "f_name" varchar(255) not null, "l_name" varchar(255) not null, "desc" varchar(255) null, "hidden" boolean not null);'
		);
	}
}
