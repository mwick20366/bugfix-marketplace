import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260401132124 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "bug" add column if not exists "claimed_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "bug" drop column if exists "claimed_at";`);
  }

}
