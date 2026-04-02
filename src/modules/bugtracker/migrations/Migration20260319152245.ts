import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260319152245 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "client" ("id" text not null, "contact_first_name" text not null, "contact_last_name" text not null, "company_name" text not null, "email" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "client_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_client_deleted_at" ON "client" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "developer" ("id" text not null, "first_name" text not null, "last_name" text not null, "email" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "developer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_developer_deleted_at" ON "developer" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "bug" ("id" text not null, "title" text not null, "description" text not null, "tech_stack" text not null, "repo_link" text null, "bounty" real null, "status" text null, "client_id" text not null, "developer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "bug_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_client_id" ON "bug" ("client_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_developer_id" ON "bug" ("developer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bug_deleted_at" ON "bug" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "bug" add constraint "bug_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade;`);
    this.addSql(`alter table if exists "bug" add constraint "bug_developer_id_foreign" foreign key ("developer_id") references "developer" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table if exists "client" rename column "contactFirstName" to "contact_first_name";`)
    this.addSql(`alter table if exists "client" rename column "contactLastName" to "contact_last_name";`)
    this.addSql(`alter table if exists "client" rename column "companyName" to "company_name";`)

    this.addSql(`alter table if exists "bug" rename column "techStack" to "tech_stack";`)
    this.addSql(`alter table if exists "bug" rename column "repoLink" to "repo_link";`)

    this.addSql(`alter table if exists "submission" rename column "fileUrl" to "file_url";`)
    this.addSql(`alter table if exists "submission" rename column "clientNotes" to "client_notes";`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "bug" drop constraint if exists "bug_client_id_foreign";`);

    this.addSql(`alter table if exists "bug" drop constraint if exists "bug_developer_id_foreign";`);

    this.addSql(`drop table if exists "client" cascade;`);

    this.addSql(`drop table if exists "developer" cascade;`);

    this.addSql(`drop table if exists "bug" cascade;`);
  }

}
