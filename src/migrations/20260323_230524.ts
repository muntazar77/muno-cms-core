import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sites_status" AS ENUM('active', 'draft', 'maintenance');
  CREATE TYPE "public"."enum_sites_font_family" AS ENUM('inter', 'geist', 'poppins', 'outfit', 'plus-jakarta-sans', 'dm-sans');
  CREATE TYPE "public"."enum_pages_blocks_hero_style" AS ENUM('gradient', 'minimal', 'split');
  CREATE TYPE "public"."enum_pages_blocks_features_style" AS ENUM('cards', 'list', 'minimal');
  CREATE TYPE "public"."enum_pages_blocks_services_cards_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_pages_blocks_steps_timeline_style" AS ENUM('timeline', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_statistics_style" AS ENUM('dark', 'light', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style" AS ENUM('cards', 'single', 'minimal');
  CREATE TYPE "public"."enum_pages_blocks_faq_style" AS ENUM('accordion', 'grid');
  CREATE TABLE "sites_header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "sites_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "sites_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "sites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_id" varchar NOT NULL,
  	"site_description" varchar,
  	"domain" varchar,
  	"subdomain" varchar,
  	"status" "enum_sites_status" DEFAULT 'active' NOT NULL,
  	"default_language" varchar DEFAULT 'en',
  	"timezone" varchar DEFAULT 'UTC',
  	"owner_id" integer,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"primary_color" varchar DEFAULT '#2563eb',
  	"secondary_color" varchar DEFAULT '#0f172a',
  	"font_family" "enum_sites_font_family" DEFAULT 'inter',
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
  	"is_deleted" boolean DEFAULT false,
  	"deleted_at" timestamp(3) with time zone,
  	"deleted_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'client');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_template";
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'full-width', 'sidebar-left', 'sidebar-right');
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE "public"."enum_pages_template" USING "template"::"public"."enum_pages_template";
  DROP INDEX "users_deleted_at_idx";
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "forms_deleted_at_idx";
  DROP INDEX "form_submissions_deleted_at_idx";
  DROP INDEX "services_deleted_at_idx";
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" DROP DEFAULT;
  ALTER TABLE "users" ADD COLUMN "site_id" varchar;
  ALTER TABLE "media" ADD COLUMN "site_id" varchar;
  ALTER TABLE "media" ADD COLUMN "is_deleted" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "deleted_by_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "style" "enum_pages_blocks_hero_style" DEFAULT 'gradient';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_link" varchar;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "style" "enum_pages_blocks_features_style" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_services_cards" ADD COLUMN "style" "enum_pages_blocks_services_cards_style" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_steps_timeline" ADD COLUMN "style" "enum_pages_blocks_steps_timeline_style" DEFAULT 'timeline';
  ALTER TABLE "pages_blocks_statistics" ADD COLUMN "style" "enum_pages_blocks_statistics_style" DEFAULT 'dark';
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "style" "enum_pages_blocks_testimonials_style" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "style" "enum_pages_blocks_faq_style" DEFAULT 'accordion';
  ALTER TABLE "pages" ADD COLUMN "site_id" varchar;
  ALTER TABLE "pages" ADD COLUMN "is_deleted" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "deleted_by_id" integer;
  ALTER TABLE "forms" ADD COLUMN "site_id" varchar;
  ALTER TABLE "forms" ADD COLUMN "is_deleted" boolean DEFAULT false;
  ALTER TABLE "forms" ADD COLUMN "deleted_by_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "site_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "is_deleted" boolean DEFAULT false;
  ALTER TABLE "form_submissions" ADD COLUMN "deleted_by_id" integer;
  ALTER TABLE "services" ADD COLUMN "site_id" varchar;
  ALTER TABLE "services" ADD COLUMN "is_deleted" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "deleted_by_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sites_id" integer;
  ALTER TABLE "sites_header_nav" ADD CONSTRAINT "sites_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites_footer_links" ADD CONSTRAINT "sites_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites_social_links" ADD CONSTRAINT "sites_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_twitter_image_id_media_id_fk" FOREIGN KEY ("twitter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sites_header_nav_order_idx" ON "sites_header_nav" USING btree ("_order");
  CREATE INDEX "sites_header_nav_parent_id_idx" ON "sites_header_nav" USING btree ("_parent_id");
  CREATE INDEX "sites_footer_links_order_idx" ON "sites_footer_links" USING btree ("_order");
  CREATE INDEX "sites_footer_links_parent_id_idx" ON "sites_footer_links" USING btree ("_parent_id");
  CREATE INDEX "sites_social_links_order_idx" ON "sites_social_links" USING btree ("_order");
  CREATE INDEX "sites_social_links_parent_id_idx" ON "sites_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sites_site_id_idx" ON "sites" USING btree ("site_id");
  CREATE UNIQUE INDEX "sites_domain_idx" ON "sites" USING btree ("domain");
  CREATE INDEX "sites_owner_idx" ON "sites" USING btree ("owner_id");
  CREATE INDEX "sites_logo_idx" ON "sites" USING btree ("logo_id");
  CREATE INDEX "sites_favicon_idx" ON "sites" USING btree ("favicon_id");
  CREATE INDEX "sites_og_image_idx" ON "sites" USING btree ("og_image_id");
  CREATE INDEX "sites_twitter_image_idx" ON "sites" USING btree ("twitter_image_id");
  CREATE INDEX "sites_is_deleted_idx" ON "sites" USING btree ("is_deleted");
  CREATE INDEX "sites_deleted_by_idx" ON "sites" USING btree ("deleted_by_id");
  CREATE INDEX "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
  CREATE INDEX "sites_created_at_idx" ON "sites" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_site_id_idx" ON "users" USING btree ("site_id");
  CREATE INDEX "media_site_id_idx" ON "media" USING btree ("site_id");
  CREATE INDEX "media_is_deleted_idx" ON "media" USING btree ("is_deleted");
  CREATE INDEX "media_deleted_by_idx" ON "media" USING btree ("deleted_by_id");
  CREATE INDEX "pages_site_id_idx" ON "pages" USING btree ("site_id");
  CREATE INDEX "pages_is_deleted_idx" ON "pages" USING btree ("is_deleted");
  CREATE INDEX "pages_deleted_by_idx" ON "pages" USING btree ("deleted_by_id");
  CREATE INDEX "forms_site_id_idx" ON "forms" USING btree ("site_id");
  CREATE INDEX "forms_is_deleted_idx" ON "forms" USING btree ("is_deleted");
  CREATE INDEX "forms_deleted_by_idx" ON "forms" USING btree ("deleted_by_id");
  CREATE INDEX "form_submissions_site_id_idx" ON "form_submissions" USING btree ("site_id");
  CREATE INDEX "form_submissions_is_deleted_idx" ON "form_submissions" USING btree ("is_deleted");
  CREATE INDEX "form_submissions_deleted_by_idx" ON "form_submissions" USING btree ("deleted_by_id");
  CREATE INDEX "services_site_id_idx" ON "services" USING btree ("site_id");
  CREATE INDEX "services_is_deleted_idx" ON "services" USING btree ("is_deleted");
  CREATE INDEX "services_deleted_by_idx" ON "services" USING btree ("deleted_by_id");
  CREATE INDEX "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");
  ALTER TABLE "users" DROP COLUMN "deleted_at";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "background_style";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "primary_c_t_a_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "primary_c_t_a_url";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "secondary_c_t_a_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "secondary_c_t_a_url";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "background_style";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "subheading";
  DROP TYPE "public"."enum_pages_blocks_hero_layout";
  DROP TYPE "public"."enum_pages_blocks_hero_background_style";
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  DROP TYPE "public"."enum_pages_blocks_features_columns";
  DROP TYPE "public"."enum_pages_blocks_features_background_style";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_layout" AS ENUM('centered', 'split-left', 'split-right');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_style" AS ENUM('none', 'pattern', 'gradient');
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('check', 'lightning', 'shield', 'star', 'heart', 'users', 'settings', 'globe');
  CREATE TYPE "public"."enum_pages_blocks_features_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_features_background_style" AS ENUM('light', 'muted', 'dark');
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_description" varchar,
  	"site_url" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"social_links_twitter" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_github" varchar,
  	"social_links_youtube" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "sites_header_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sites_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sites_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sites" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sites_header_nav" CASCADE;
  DROP TABLE "sites_footer_links" CASCADE;
  DROP TABLE "sites_social_links" CASCADE;
  DROP TABLE "sites" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_deleted_by_id_users_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_deleted_by_id_users_id_fk";
  
  ALTER TABLE "forms" DROP CONSTRAINT "forms_deleted_by_id_users_id_fk";
  
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_deleted_by_id_users_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_deleted_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sites_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_template";
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'landing-page', 'about-page', 'services-page', 'contact-page');
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE "public"."enum_pages_template" USING "template"::"public"."enum_pages_template";
  DROP INDEX "users_site_id_idx";
  DROP INDEX "media_site_id_idx";
  DROP INDEX "media_is_deleted_idx";
  DROP INDEX "media_deleted_by_idx";
  DROP INDEX "pages_site_id_idx";
  DROP INDEX "pages_is_deleted_idx";
  DROP INDEX "pages_deleted_by_idx";
  DROP INDEX "forms_site_id_idx";
  DROP INDEX "forms_is_deleted_idx";
  DROP INDEX "forms_deleted_by_idx";
  DROP INDEX "form_submissions_site_id_idx";
  DROP INDEX "form_submissions_is_deleted_idx";
  DROP INDEX "form_submissions_deleted_by_idx";
  DROP INDEX "services_site_id_idx";
  DROP INDEX "services_is_deleted_idx";
  DROP INDEX "services_deleted_by_idx";
  DROP INDEX "payload_locked_documents_rels_sites_id_idx";
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DEFAULT 'check'::"public"."enum_pages_blocks_features_features_icon";
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_features_features_icon" USING "icon"::"public"."enum_pages_blocks_features_features_icon";
  ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "layout" "enum_pages_blocks_hero_layout" DEFAULT 'centered';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "background_style" "enum_pages_blocks_hero_background_style" DEFAULT 'none';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "primary_c_t_a_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "primary_c_t_a_url" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "secondary_c_t_a_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "secondary_c_t_a_url" varchar;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "columns" "enum_pages_blocks_features_columns" DEFAULT '3';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "background_style" "enum_pages_blocks_features_background_style" DEFAULT 'light';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "subheading" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "forms_deleted_at_idx" ON "forms" USING btree ("deleted_at");
  CREATE INDEX "form_submissions_deleted_at_idx" ON "form_submissions" USING btree ("deleted_at");
  CREATE INDEX "services_deleted_at_idx" ON "services" USING btree ("deleted_at");
  ALTER TABLE "users" DROP COLUMN "site_id";
  ALTER TABLE "media" DROP COLUMN "site_id";
  ALTER TABLE "media" DROP COLUMN "is_deleted";
  ALTER TABLE "media" DROP COLUMN "deleted_by_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_link";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_services_cards" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_steps_timeline" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_statistics" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "style";
  ALTER TABLE "pages" DROP COLUMN "site_id";
  ALTER TABLE "pages" DROP COLUMN "is_deleted";
  ALTER TABLE "pages" DROP COLUMN "deleted_by_id";
  ALTER TABLE "forms" DROP COLUMN "site_id";
  ALTER TABLE "forms" DROP COLUMN "is_deleted";
  ALTER TABLE "forms" DROP COLUMN "deleted_by_id";
  ALTER TABLE "form_submissions" DROP COLUMN "site_id";
  ALTER TABLE "form_submissions" DROP COLUMN "is_deleted";
  ALTER TABLE "form_submissions" DROP COLUMN "deleted_by_id";
  ALTER TABLE "services" DROP COLUMN "site_id";
  ALTER TABLE "services" DROP COLUMN "is_deleted";
  ALTER TABLE "services" DROP COLUMN "deleted_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sites_id";
  DROP TYPE "public"."enum_sites_status";
  DROP TYPE "public"."enum_sites_font_family";
  DROP TYPE "public"."enum_pages_blocks_hero_style";
  DROP TYPE "public"."enum_pages_blocks_features_style";
  DROP TYPE "public"."enum_pages_blocks_services_cards_style";
  DROP TYPE "public"."enum_pages_blocks_steps_timeline_style";
  DROP TYPE "public"."enum_pages_blocks_statistics_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style";
  DROP TYPE "public"."enum_pages_blocks_faq_style";`)
}
