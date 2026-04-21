import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260413214845 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "attachment" ("id" text not null, "file_id" text not null, "file_url" text not null, "filename" text not null, "bug_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attachment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attachment_bug_id" ON "attachment" ("bug_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attachment_deleted_at" ON "attachment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "attachment" add constraint "attachment_bug_id_foreign" foreign key ("bug_id") references "bug" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attachment" cascade;`);
  }

}
