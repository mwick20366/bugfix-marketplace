import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260329140945 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "submission" add column if not exists "client_notes" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "submission" drop column if exists "client_notes";`);
  }

}
