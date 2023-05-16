import { Migration } from '@mikro-orm/migrations';

export class Migration20230516152241 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "characters" add column "featured" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "characters" drop column "featured";');
  }

}
