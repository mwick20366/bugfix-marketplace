import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260323133944 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "submission" ("id" text not null, "notes" text null, "fileUrl" text null, "status" text null, "bug_id" text not null, "developer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "submission_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_submission_bug_id" ON "submission" ("bug_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_submission_developer_id" ON "submission" ("developer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_submission_deleted_at" ON "submission" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "submission" add constraint "submission_bug_id_foreign" foreign key ("bug_id") references "bug" ("id") on update cascade;`);
    this.addSql(`alter table if exists "submission" add constraint "submission_developer_id_foreign" foreign key ("developer_id") references "developer" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "submission" cascade;`);
  }

}
