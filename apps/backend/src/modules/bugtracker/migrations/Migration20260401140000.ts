import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260401132124 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "client" rename column "contactFirstName" to "contact_first_name";`)
    this.addSql(`alter table if exists "client" rename column "contactLastName" to "contact_last_name";`)
    this.addSql(`alter table if exists "client" rename column "companyName" to "company_name";`)

    this.addSql(`alter table if exists "bug" rename column "techStack" to "tech_stack";`)
    this.addSql(`alter table if exists "bug" rename column "repoLink" to "repo_link";`)

    this.addSql(`alter table if exists "submission" rename column "fileUrl" to "file_url";`)
    this.addSql(`alter table if exists "submission" rename column "clientNotes" to "client_notes";`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "client" rename column "contact_first_name" to "contactFirstName";`)
    this.addSql(`alter table if exists "client" rename column "contact_last_name" to "contactLastName";`)
    this.addSql(`alter table if exists "client" rename column "company_name" to "companyName";`)

    this.addSql(`alter table if exists "bug" rename column "tech_stack" to "techStack";`)
    this.addSql(`alter table if exists "bug" rename column "repo_link" to "repoLink";`)

    this.addSql(`alter table if exists "submission" rename column "file_url" to "fileUrl";`)
    this.addSql(`alter table if exists "submission" rename column "client_notes" to "clientNotes";`)
  }
}
