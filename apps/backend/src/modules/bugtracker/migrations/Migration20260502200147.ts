import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260502200147 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "client" add column if not exists "stripe_customer_id" text null;`);

    this.addSql(`alter table if exists "submission" add column if not exists "payment_method_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "client" drop column if exists "stripe_customer_id";`);

    this.addSql(`alter table if exists "submission" drop column if exists "payment_method_id";`);
  }

}
