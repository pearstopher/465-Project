import { Migration } from '@mikro-orm/migrations';

export class Migration20230605232409 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "characters" add column "user" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "characters" drop column "user";');
  }

}
