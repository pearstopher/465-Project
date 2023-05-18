import { Migration } from '@mikro-orm/migrations';

export class Migration20230518012222 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "characters" add column "avatar" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "characters" drop column "avatar";');
  }

}
