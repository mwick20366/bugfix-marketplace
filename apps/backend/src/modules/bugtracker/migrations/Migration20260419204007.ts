import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260419204007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "developer" add column if not exists "tech_stack" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "developer" drop column if exists "tech_stack";`);
  }

}
