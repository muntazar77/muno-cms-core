import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Update Users role enum: admin/editor/user → admin/client ──
  // Rename old enum, create new one, migrate column, drop old
  await db.execute(sql`
    ALTER TYPE "public"."enum_users_role" RENAME TO "enum_users_role_old";
    CREATE TYPE "public"."enum_users_role" AS ENUM ('admin', 'client');
    ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."enum_users_role"
      USING (CASE WHEN "role"::text = 'admin' THEN 'admin' ELSE 'client' END)::"public"."enum_users_role";
    ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::"public"."enum_users_role";
    DROP TYPE "public"."enum_users_role_old";
  `)

  // ── 2. Add siteId to users ──
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    CREATE INDEX IF NOT EXISTS "users_site_id_idx" ON "users" USING btree ("site_id");
  `)

  // ── 3. Add soft delete fields + siteId to pages ──
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3) with time zone;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "deleted_by_id" integer;
    CREATE INDEX IF NOT EXISTS "pages_site_id_idx" ON "pages" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "pages_is_deleted_idx" ON "pages" USING btree ("is_deleted");
    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_deleted_by_id_users_id_fk"
        FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // ── 4. Add soft delete fields + siteId to media ──
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3) with time zone;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "deleted_by_id" integer;
    CREATE INDEX IF NOT EXISTS "media_site_id_idx" ON "media" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "media_is_deleted_idx" ON "media" USING btree ("is_deleted");
    DO $$ BEGIN
      ALTER TABLE "media" ADD CONSTRAINT "media_deleted_by_id_users_id_fk"
        FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // ── 5. Add soft delete fields + siteId to forms ──
  await db.execute(sql`
    ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false;
    ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3) with time zone;
    ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "deleted_by_id" integer;
    CREATE INDEX IF NOT EXISTS "forms_site_id_idx" ON "forms" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "forms_is_deleted_idx" ON "forms" USING btree ("is_deleted");
    DO $$ BEGIN
      ALTER TABLE "forms" ADD CONSTRAINT "forms_deleted_by_id_users_id_fk"
        FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // ── 6. Add soft delete fields + siteId to form_submissions ──
  await db.execute(sql`
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3) with time zone;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "deleted_by_id" integer;
    CREATE INDEX IF NOT EXISTS "form_submissions_site_id_idx" ON "form_submissions" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "form_submissions_is_deleted_idx" ON "form_submissions" USING btree ("is_deleted");
    DO $$ BEGIN
      ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_deleted_by_id_users_id_fk"
        FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // ── 7. Add soft delete fields + siteId to services ──
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "site_id" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3) with time zone;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "deleted_by_id" integer;
    CREATE INDEX IF NOT EXISTS "services_site_id_idx" ON "services" USING btree ("site_id");
    CREATE INDEX IF NOT EXISTS "services_is_deleted_idx" ON "services" USING btree ("is_deleted");
    DO $$ BEGIN
      ALTER TABLE "services" ADD CONSTRAINT "services_deleted_by_id_users_id_fk"
        FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove soft delete + siteId columns from all collections
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "deleted_by_id";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "deleted_at";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "is_deleted";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "site_id";

    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "deleted_by_id";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "deleted_at";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "is_deleted";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "site_id";

    ALTER TABLE "forms" DROP COLUMN IF EXISTS "deleted_by_id";
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "deleted_at";
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "is_deleted";
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "site_id";

    ALTER TABLE "media" DROP COLUMN IF EXISTS "deleted_by_id";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "deleted_at";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "is_deleted";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "site_id";

    ALTER TABLE "pages" DROP COLUMN IF EXISTS "deleted_by_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "deleted_at";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "is_deleted";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "site_id";

    ALTER TABLE "users" DROP COLUMN IF EXISTS "site_id";
  `)
}
