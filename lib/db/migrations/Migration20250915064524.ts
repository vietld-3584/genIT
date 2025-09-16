import { Migration } from '@mikro-orm/migrations';

export class Migration20250915064524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "brands" ("id" serial primary key, "name" varchar(100) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "categories" ("id" serial primary key, "name" varchar(100) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "channels" ("id" serial primary key, "channel_name" varchar(50) not null, "icon_url" varchar(255) null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`alter table "channels" add constraint "channels_channel_name_unique" unique ("channel_name");`);

    this.addSql(`create table "documents" ("id" serial primary key, "title" varchar(255) null, "file_path" varchar(255) null, "file_type" varchar(20) null, "file_size" int null, "uploaded_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "products" ("id" serial primary key, "name" varchar(255) not null, "description" text null, "sku" varchar(100) not null, "price" numeric(12,2) not null, "original_price" numeric(12,2) null, "discount_percent" int null, "availability" varchar(50) not null, "rating" numeric(3,2) null, "review_count" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "category_id" int not null, "brand_id" int null);`);
    this.addSql(`alter table "products" add constraint "products_sku_unique" unique ("sku");`);

    this.addSql(`create table "product_images" ("id" serial primary key, "url" varchar(500) not null, "is_main" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, "product_id" int not null);`);

    this.addSql(`create table "product_options" ("id" serial primary key, "option_type" varchar(50) not null, "option_value" varchar(100) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "product_id" int not null);`);

    this.addSql(`create table "user_accounts" ("id" serial primary key, "name" varchar(64) not null, "title" varchar(100) null, "avatar_image" bytea null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`alter table "user_accounts" add constraint "user_accounts_email_unique" unique ("email");`);

    this.addSql(`create table "reviews" ("id" serial primary key, "rating" smallint not null, "comment" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "product_id" int not null, "user_account_id" int not null);`);

    this.addSql(`create table "messages" ("id" serial primary key, "message_text" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "channel_id" int not null, "user_account_id" int null);`);

    this.addSql(`create table "attachments" ("id" serial primary key, "file_url" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "message_id" int not null);`);

    this.addSql(`create table "login_logs" ("id" serial primary key, "email" varchar(255) null, "success" boolean not null, "error_message" varchar(255) null, "created_at" timestamptz not null, "user_id" int null, "user_account_id" int null);`);

    this.addSql(`create table "email_confirmation_codes" ("id" serial primary key, "code" varchar(6) not null, "expires_at" timestamptz not null, "is_used" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_account_id" int not null);`);

    this.addSql(`create table "comparisons" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_account_id" int not null, "product_id" int not null);`);

    this.addSql(`create table "channel_members" ("id" serial primary key, "role" varchar(50) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "channel_id" int not null, "user_account_id" int not null);`);
    this.addSql(`alter table "channel_members" add constraint "channel_members_channel_id_user_account_id_unique" unique ("channel_id", "user_account_id");`);

    this.addSql(`create table "user_logs" ("id" serial primary key, "action" varchar(50) not null, "details" jsonb null, "created_at" timestamptz not null, "user_account_id" int not null);`);

    this.addSql(`create table "user_profiles" ("id" serial primary key, "profile_photo" bytea null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_account_id" int not null);`);
    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_account_id_unique" unique ("user_account_id");`);

    this.addSql(`create table "wishlists" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "product_id" int not null);`);

    this.addSql(`alter table "products" add constraint "products_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`);
    this.addSql(`alter table "products" add constraint "products_brand_id_foreign" foreign key ("brand_id") references "brands" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`alter table "product_options" add constraint "product_options_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`alter table "reviews" add constraint "reviews_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "reviews" add constraint "reviews_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "messages" add constraint "messages_channel_id_foreign" foreign key ("channel_id") references "channels" ("id") on update cascade;`);
    this.addSql(`alter table "messages" add constraint "messages_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "attachments" add constraint "attachments_message_id_foreign" foreign key ("message_id") references "messages" ("id") on update cascade;`);

    this.addSql(`alter table "login_logs" add constraint "login_logs_user_id_foreign" foreign key ("user_id") references "user_accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "login_logs" add constraint "login_logs_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "email_confirmation_codes" add constraint "email_confirmation_codes_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "comparisons" add constraint "comparisons_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);
    this.addSql(`alter table "comparisons" add constraint "comparisons_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`alter table "channel_members" add constraint "channel_members_channel_id_foreign" foreign key ("channel_id") references "channels" ("id") on update cascade;`);
    this.addSql(`alter table "channel_members" add constraint "channel_members_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "user_logs" add constraint "user_logs_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "wishlists" add constraint "wishlists_user_id_foreign" foreign key ("user_id") references "user_accounts" ("id") on update cascade;`);
    this.addSql(`alter table "wishlists" add constraint "wishlists_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
  }

}
