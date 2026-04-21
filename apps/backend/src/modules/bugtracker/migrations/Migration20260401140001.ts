import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260401132124 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "developer" rename column "firstName" to "first_name";`)
    this.addSql(`alter table if exists "developer" rename column "lastName" to "last_name";`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "developer" rename column "first_name" to "firstName";`)
    this.addSql(`alter table if exists "developer" rename column "last_name" to "lastName";`)
    this.addSql(`alter table if exists "developer" rename column "email" to "email";`)
  }
}
