import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260404152939 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "developer_review" ("id" text not null, "rating" real not null, "notes" text null, "developer_id" text not null, "client_id" text not null, "submission_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "developer_review_pkey" primary key ("id"), constraint rating_range check (rating >= 1 AND rating <= 5));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_developer_review_developer_id" ON "developer_review" ("developer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_developer_review_client_id" ON "developer_review" ("client_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_developer_review_submission_id" ON "developer_review" ("submission_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_developer_review_deleted_at" ON "developer_review" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "developer_review" add constraint "developer_review_developer_id_foreign" foreign key ("developer_id") references "developer" ("id") on update cascade;`);
    this.addSql(`alter table if exists "developer_review" add constraint "developer_review_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade;`);
    this.addSql(`alter table if exists "developer_review" add constraint "developer_review_submission_id_foreign" foreign key ("submission_id") references "submission" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "developer_review" cascade;`);
  }

}
