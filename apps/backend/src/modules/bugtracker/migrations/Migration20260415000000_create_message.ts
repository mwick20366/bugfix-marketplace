// src/modules/bugtracker/migrations/Migration20260415000000_create_message.ts
import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260415000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "message" (
      "id" text not null,
      "submission_id" text null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "message_pkey" primary key ("id")
    );`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_message_submission_id" ON "message" ("submission_id") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_message_submission_id";`)
    this.addSql(`drop table if exists "message" cascade;`)
  }
}
