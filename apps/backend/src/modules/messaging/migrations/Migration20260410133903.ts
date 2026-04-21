import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260410133903 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "message" ("id" text not null, "bug_id" text not null, "sender_type" text check ("sender_type" in ('client', 'developer')) not null, "sender_id" text not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "message_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_message_deleted_at" ON "message" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "message" cascade;`);
  }

}
