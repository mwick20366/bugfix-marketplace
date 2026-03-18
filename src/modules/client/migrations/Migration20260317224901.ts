import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260317224901 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "client" ("id" text not null, "contactFirstName" text not null, "contactLastName" text not null, "companyName" text not null, "email" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "client_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_client_deleted_at" ON "client" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "client" cascade;`);
  }

}
