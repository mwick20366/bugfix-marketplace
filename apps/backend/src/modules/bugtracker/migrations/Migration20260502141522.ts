import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260502141522 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "developer" add column if not exists "is_payout_ready" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "developer" drop column if exists "is_payout_ready";`);
  }

}
