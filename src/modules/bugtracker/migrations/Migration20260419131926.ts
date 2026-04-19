import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260419131926 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "client" add column if not exists "avatar_url" text null;`);

    this.addSql(`alter table if exists "developer" add column if not exists "avatar_url" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "client" drop column if exists "avatar_url";`);

    this.addSql(`alter table if exists "developer" drop column if exists "avatar_url";`);
  }

}
