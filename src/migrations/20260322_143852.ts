import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_sites_status') THEN
        CREATE TYPE "public"."enum_sites_status" AS ENUM('active', 'draft', 'maintenance');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_sites_font_family') THEN
        CREATE TYPE "public"."enum_sites_font_family" AS ENUM('inter', 'geist', 'poppins', 'outfit', 'plus-jakarta-sans', 'dm-sans');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "sites" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar NOT NULL,
      "site_id" varchar NOT NULL,
      "site_description" varchar,
      "domain" varchar,
      "subdomain" varchar,
      "status" "public"."enum_sites_status" DEFAULT 'active' NOT NULL,
      "default_language" varchar DEFAULT 'en',
      "timezone" varchar DEFAULT 'UTC',
      "logo_id" integer,
      "favicon_id" integer,
      "primary_color" varchar DEFAULT '#2563eb',
      "secondary_color" varchar DEFAULT '#0f172a',
      "font_family" "public"."enum_sites_font_family" DEFAULT 'inter',
      "cta_label" varchar,
      "cta_url" varchar,
      "show_site_title" boolean DEFAULT true,
      "show_language_switcher" boolean DEFAULT false,
      "show_theme_toggle" boolean DEFAULT false,
      "sticky_header" boolean DEFAULT true,
      "show_newsletter_signup" boolean DEFAULT false,
      "footer_tagline" varchar,
      "footer_note" varchar,
      "copyright_text" varchar,
      "default_meta_title" varchar,
      "default_meta_description" varchar,
      "og_image_id" integer,
      "twitter_image_id" integer,
      "allow_indexing" boolean DEFAULT true,
      "public_email" varchar,
      "phone" varchar,
      "whatsapp" varchar,
      "address" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "sites_header_nav" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "sites_footer_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "sites_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" varchar NOT NULL,
      "label" varchar,
      "url" varchar NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "sites_id" integer;

    DO $$ BEGIN
      ALTER TABLE "sites" ADD CONSTRAINT "sites_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites" ADD CONSTRAINT "sites_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites" ADD CONSTRAINT "sites_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites" ADD CONSTRAINT "sites_twitter_image_id_media_id_fk" FOREIGN KEY ("twitter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites_header_nav" ADD CONSTRAINT "sites_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites_footer_links" ADD CONSTRAINT "sites_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "sites_social_links" ADD CONSTRAINT "sites_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "sites_site_id_idx" ON "sites" USING btree ("site_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "sites_domain_idx" ON "sites" USING btree ("domain");
    CREATE INDEX IF NOT EXISTS "sites_subdomain_idx" ON "sites" USING btree ("subdomain");
    CREATE INDEX IF NOT EXISTS "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "sites_created_at_idx" ON "sites" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "sites_logo_idx" ON "sites" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "sites_favicon_idx" ON "sites" USING btree ("favicon_id");
    CREATE INDEX IF NOT EXISTS "sites_og_image_idx" ON "sites" USING btree ("og_image_id");
    CREATE INDEX IF NOT EXISTS "sites_twitter_image_idx" ON "sites" USING btree ("twitter_image_id");
    CREATE INDEX IF NOT EXISTS "sites_header_nav_order_idx" ON "sites_header_nav" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sites_header_nav_parent_id_idx" ON "sites_header_nav" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sites_footer_links_order_idx" ON "sites_footer_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sites_footer_links_parent_id_idx" ON "sites_footer_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sites_social_links_order_idx" ON "sites_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sites_social_links_parent_id_idx" ON "sites_social_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");

    INSERT INTO "sites" (
      "site_name",
      "site_id",
      "status",
      "default_language",
      "timezone",
      "primary_color",
      "secondary_color",
      "font_family",
      "footer_tagline",
      "allow_indexing"
    )
    SELECT
      'Default Site',
      'default-site',
      'active'::"public"."enum_sites_status",
      'en',
      'UTC',
      '#2563eb',
      '#0f172a',
      'inter'::"public"."enum_sites_font_family",
      'Building the modern web, one block at a time.',
      true
    WHERE NOT EXISTS (SELECT 1 FROM "sites");

    UPDATE "users"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;

    UPDATE "pages"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;

    UPDATE "media"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;

    UPDATE "forms"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;

    UPDATE "form_submissions"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;

    UPDATE "services"
    SET "site_id" = COALESCE("site_id", 'default-site')
    WHERE "site_id" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_sites_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "sites_id";

    DROP TABLE IF EXISTS "sites_social_links" CASCADE;
    DROP TABLE IF EXISTS "sites_footer_links" CASCADE;
    DROP TABLE IF EXISTS "sites_header_nav" CASCADE;
    DROP TABLE IF EXISTS "sites" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_sites_font_family";
    DROP TYPE IF EXISTS "public"."enum_sites_status";
  `)
}