import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260411130657 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "message" add column if not exists "is_read" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "message" drop column if exists "is_read";`);
  }

}
