import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260414222028 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "bug_attachment" ("id" text not null, "file_id" text not null, "file_url" text not null, "filename" text not null, "bug_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "bug_attachment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_attachment_bug_id" ON "bug_attachment" ("bug_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_attachment_deleted_at" ON "bug_attachment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "submission_attachment" ("id" text not null, "file_id" text not null, "file_url" text not null, "filename" text not null, "submission_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "submission_attachment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_submission_attachment_submission_id" ON "submission_attachment" ("submission_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_submission_attachment_deleted_at" ON "submission_attachment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "bug_attachment" add constraint "bug_attachment_bug_id_foreign" foreign key ("bug_id") references "bug" ("id") on update cascade;`);

    this.addSql(`alter table if exists "submission_attachment" add constraint "submission_attachment_submission_id_foreign" foreign key ("submission_id") references "submission" ("id") on update cascade;`);

    this.addSql(`drop table if exists "attachment" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "attachment" ("id" text not null, "file_id" text not null, "file_url" text not null, "filename" text not null, "bug_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attachment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attachment_bug_id" ON "attachment" ("bug_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attachment_deleted_at" ON "attachment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "attachment" add constraint "attachment_bug_id_foreign" foreign key ("bug_id") references "bug" ("id") on update cascade;`);

    this.addSql(`drop table if exists "bug_attachment" cascade;`);

    this.addSql(`drop table if exists "submission_attachment" cascade;`);
  }

}
