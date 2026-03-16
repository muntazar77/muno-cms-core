import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_layout" AS ENUM('centered', 'split-left', 'split-right');
  CREATE TYPE "public"."enum_pages_blocks_hero_background_style" AS ENUM('none', 'pattern', 'gradient');
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('check', 'lightning', 'shield', 'star', 'heart', 'users', 'settings', 'globe');
  CREATE TYPE "public"."enum_pages_blocks_features_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_features_background_style" AS ENUM('light', 'muted', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('default', 'centered', 'withBackground');
  CREATE TYPE "public"."enum_pages_blocks_hero_with_image_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('landing', 'blog', 'about', 'contact', 'custom');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'landing-page', 'about-page', 'services-page', 'contact-page');
  CREATE TYPE "public"."enum_pages_branding_header_variant" AS ENUM('default', 'centered', 'minimal', 'transparent');
  CREATE TYPE "public"."enum_pages_branding_footer_variant" AS ENUM('default', 'centered', 'minimal', 'columns');
  CREATE TYPE "public"."enum_pages_visibility" AS ENUM('public', 'private', 'password-protected');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'email', 'textarea', 'select', 'file');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_hero_layout" DEFAULT 'centered',
  	"background_style" "enum_pages_blocks_hero_background_style" DEFAULT 'none',
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_features_icon" DEFAULT 'check',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_features_columns" DEFAULT '3',
  	"background_style" "enum_pages_blocks_features_background_style" DEFAULT 'light',
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_with_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"primary_cta_label" varchar,
  	"primary_cta_link" varchar,
  	"secondary_cta_label" varchar,
  	"alignment" "enum_pages_blocks_hero_with_image_alignment" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_cards_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_services_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_table_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"description" varchar,
  	"features" varchar,
  	"cta_label" varchar DEFAULT 'Get Started',
  	"cta_link" varchar,
  	"highlighted" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_pricing_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"page_type" "enum_pages_page_type",
  	"template" "enum_pages_template",
  	"parent_page_id" integer,
  	"page_name" varchar,
  	"short_description" varchar,
  	"author" varchar,
  	"branding_logo_url" varchar,
  	"branding_favicon_url" varchar,
  	"branding_header_variant" "enum_pages_branding_header_variant",
  	"branding_footer_variant" "enum_pages_branding_footer_variant",
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_canonical_url" varchar,
  	"meta_robots_index" boolean DEFAULT true,
  	"meta_image_id" integer,
  	"meta_twitter_image_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"visibility" "enum_pages_visibility" DEFAULT 'public',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_forms_fields_type" NOT NULL,
  	"required" boolean DEFAULT false
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_message" varchar DEFAULT 'Thank you for your submission.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"data" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
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
  
  ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_with_image" ADD CONSTRAINT "pages_blocks_hero_with_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_with_image" ADD CONSTRAINT "pages_blocks_hero_with_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_cards_services" ADD CONSTRAINT "pages_blocks_services_cards_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_cards" ADD CONSTRAINT "pages_blocks_services_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_timeline_steps" ADD CONSTRAINT "pages_blocks_steps_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_timeline" ADD CONSTRAINT "pages_blocks_steps_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics_stats" ADD CONSTRAINT "pages_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud" ADD CONSTRAINT "pages_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_table_plans" ADD CONSTRAINT "pages_blocks_pricing_table_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_table" ADD CONSTRAINT "pages_blocks_pricing_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_page_id_pages_id_fk" FOREIGN KEY ("parent_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_twitter_image_id_media_id_fk" FOREIGN KEY ("meta_twitter_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_fields_options" ADD CONSTRAINT "forms_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_order_idx" ON "pages_blocks_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_parent_id_idx" ON "pages_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_path_idx" ON "pages_blocks_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_form_idx" ON "pages_blocks_form" USING btree ("form_id");
  CREATE INDEX "pages_blocks_hero_with_image_order_idx" ON "pages_blocks_hero_with_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_with_image_parent_id_idx" ON "pages_blocks_hero_with_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_with_image_path_idx" ON "pages_blocks_hero_with_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_with_image_image_idx" ON "pages_blocks_hero_with_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_services_cards_services_order_idx" ON "pages_blocks_services_cards_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_cards_services_parent_id_idx" ON "pages_blocks_services_cards_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_cards_order_idx" ON "pages_blocks_services_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_cards_parent_id_idx" ON "pages_blocks_services_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_cards_path_idx" ON "pages_blocks_services_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_timeline_steps_order_idx" ON "pages_blocks_steps_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_timeline_steps_parent_id_idx" ON "pages_blocks_steps_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_timeline_order_idx" ON "pages_blocks_steps_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_timeline_parent_id_idx" ON "pages_blocks_steps_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_timeline_path_idx" ON "pages_blocks_steps_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_statistics_stats_order_idx" ON "pages_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_stats_parent_id_idx" ON "pages_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_cloud_logos_order_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_logos_parent_id_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_logos_image_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_cloud_order_idx" ON "pages_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_parent_id_idx" ON "pages_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_path_idx" ON "pages_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_table_plans_order_idx" ON "pages_blocks_pricing_table_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_table_plans_parent_id_idx" ON "pages_blocks_pricing_table_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_table_order_idx" ON "pages_blocks_pricing_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_table_parent_id_idx" ON "pages_blocks_pricing_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_table_path_idx" ON "pages_blocks_pricing_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_page_idx" ON "pages" USING btree ("parent_page_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_meta_meta_twitter_image_idx" ON "pages" USING btree ("meta_twitter_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "forms_fields_options_order_idx" ON "forms_fields_options" USING btree ("_order");
  CREATE INDEX "forms_fields_options_parent_id_idx" ON "forms_fields_options" USING btree ("_parent_id");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_deleted_at_idx" ON "forms" USING btree ("deleted_at");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_deleted_at_idx" ON "form_submissions" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_featured_image_idx" ON "services" USING btree ("featured_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_deleted_at_idx" ON "services" USING btree ("deleted_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_features_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_with_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_cards_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statistics_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_table_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_form" CASCADE;
  DROP TABLE "pages_blocks_hero_with_image" CASCADE;
  DROP TABLE "pages_blocks_services_cards_services" CASCADE;
  DROP TABLE "pages_blocks_services_cards" CASCADE;
  DROP TABLE "pages_blocks_steps_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_steps_timeline" CASCADE;
  DROP TABLE "pages_blocks_statistics_stats" CASCADE;
  DROP TABLE "pages_blocks_statistics" CASCADE;
  DROP TABLE "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud" CASCADE;
  DROP TABLE "pages_blocks_pricing_table_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing_table" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "forms_fields_options" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  DROP INDEX "users_deleted_at_idx";
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "users" DROP COLUMN "deleted_at";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  DROP TYPE "public"."enum_pages_blocks_hero_layout";
  DROP TYPE "public"."enum_pages_blocks_hero_background_style";
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  DROP TYPE "public"."enum_pages_blocks_features_columns";
  DROP TYPE "public"."enum_pages_blocks_features_background_style";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_hero_with_image_alignment";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_branding_header_variant";
  DROP TYPE "public"."enum_pages_branding_footer_variant";
  DROP TYPE "public"."enum_pages_visibility";
  DROP TYPE "public"."enum_forms_fields_type";`)
}
