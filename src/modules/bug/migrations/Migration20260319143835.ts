import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260319143835 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "bug" ("id" text not null, "title" text not null, "description" text not null, "techStack" text not null, "repoLink" text null, "bounty" real null, "status" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "bug_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_deleted_at" ON "bug" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bug" cascade;`);
  }

}
