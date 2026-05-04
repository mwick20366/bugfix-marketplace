import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260501202622 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "developer" add column if not exists "stripe_account_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "developer" drop column if exists "stripe_account_id";`);
  }

}
