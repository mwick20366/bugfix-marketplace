import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260406221555 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "in_app_notification" ("id" text not null, "recipient_id" text not null, "recipient_type" text not null, "message" text not null, "resource_id" text null, "resource_type" text null, "resource_url" text null, "is_read" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "in_app_notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_IN_APP_NOTIFICATION_RECIPIENT" ON "in_app_notification" ("recipient_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_in_app_notification_deleted_at" ON "in_app_notification" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "in_app_notification" cascade;`);
  }

}
