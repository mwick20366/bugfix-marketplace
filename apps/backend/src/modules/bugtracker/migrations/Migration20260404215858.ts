import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260404215858 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "bug" add column if not exists "difficulty" text check ("difficulty" in ('easy', 'medium', 'hard')) not null default 'medium';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "bug" drop column if exists "difficulty";`);
  }

}
