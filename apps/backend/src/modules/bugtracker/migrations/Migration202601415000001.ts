// src/modules/bugtracker/migrations/Migration202507021200_update_message_for_submissions.ts
import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration202507021200 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "message" alter column "bug_id" drop not null;`)
    this.addSql(`alter table if exists "message" add column if not exists "submission_id" text null;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_message_submission_id" ON "message" ("submission_id") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_message_submission_id";`)
    this.addSql(`alter table if exists "message" drop column if exists "submission_id";`)
    this.addSql(`alter table if exists "message" alter column "bug_id" set not null;`)
  }
}
