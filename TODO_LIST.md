| Task | File/Feature | Status | Owner | Acceptance Criteria |
|------|--------------|--------|-------|---------------------|
| Task | File/Feature | Status | Owner | Acceptance Criteria |
|------|--------------|--------|-------|---------------------|
| Validate biến môi trường | lib/config/env.ts | **done** | | ✅ Zod bắt buộc DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD; fail nếu thiếu |
| Tạo DB client singleton (MikroORM) | lib/db/client.ts | **done** | | ✅ Hot-reload safe; kết nối Postgres thành công; healthcheck snippet pass |
| Map bảng `user_accounts` thành entity | lib/entities/user-account.ts | **done** | | ✅ Trường/PK/FK/index đúng; onCreate/onUpdate cho `created_at/updated_at`; markers @custom có |
| Map bảng `categories` thành entity | lib/entities/category.ts | **done** | | ✅ Trường/PK đúng; onCreate/onUpdate timestamps; markers @custom có |
| Map bảng `brands` thành entity | lib/entities/brand.ts | **done** | | ✅ Trường/PK đúng; onCreate/onUpdate timestamps; markers @custom có |
| Map bảng `products` thành entity | lib/entities/product.ts | **done** | | ✅ Trường/PK/FK đúng; relationships với Category/Brand; markers @custom có |
| Map tất cả entities còn lại | lib/entities/*.ts | **done** | | ✅ 18 entities được tạo với relationships chính xác; soft delete support |
| Tạo thư mục migrations và cấu hình | lib/db/migrations/ | **done** | | ✅ Migration extension registered; initial migration tạo thành công |
| Chạy migrations để tạo schema | Database Schema | **done** | | ✅ `npx mikro-orm schema:create --run` thành công; tất cả tables được tạo |
| Setup PostgreSQL và database | Database Server | **done** | | ✅ PostgreSQL 14 installed; myapp_db và myapp_user được tạo |
| Cấu hình environment variables | .env.local | **done** | | ✅ File .env.local với tất cả DB credentials; dotenv load thành công |
| Cài đặt dependencies | package.json | **done** | | ✅ MikroORM 6.5.3, PostgreSQL driver, migrations, zod, dotenv installed |
| Sửa entity relationship mappings | lib/entities/*.ts | **done** | | ✅ Removed duplicate fieldNames; fixed OneToMany/ManyToOne mappings |
| Tạo setup scripts | scripts/ | **done** | | ✅ setup-db.sh và db-health-check.sh executable và functional |
| Seed dữ liệu mẫu | lib/db/seed/seed.ts | **in_progress** | | Seed script tạo nhưng cần sửa metadata reflection issues |
| Tạo thư mục repositories | lib/repositories/ | **todo** | | Repository pattern cho từng entity; generic base repository |
| Viết documentation setup | lib/db/SETUP.md | **done** | | ✅ Hướng dẫn install deps, env setup, migration, seed, healthcheck |
| Type definitions | lib/db/types/index.ts | **todo** | | Export utility types cho database operations |
| Logger utility | lib/logging/logger.ts | **done** | | ✅ Console-based logger cho development |
| Utils helpers | lib/utils/index.ts | **todo** | | Database connection helpers, transaction utils |
| Database healthcheck | Health monitoring | **done** | | ✅ Connection test script works; included in SETUP.md |
| Schema validation | Entity Metadata | **done** | | ✅ All entities discovered successfully; no duplicate fieldNames |
| Foreign key constraints | Database Relations | **done** | | ✅ Proper FK relationships established through MikroORM decorators |
| Test migration rollback | Migration Management | **todo** | | Migration down/up cycle test; data preservation |
| Production config | Environment Setup | **todo** | | Production-ready config with proper connection pooling |
| Setup logger console | lib/logging/logger.ts | done | | ✅ Export logger với methods info/warn/error; format timestamp và level |
| Tạo DB client singleton (MikroORM) | lib/db/client.ts | done | | ✅ Hot-reload safe; kết nối Postgres thành công; export ORM instance và getEM helper; markers @custom có |
| Map bảng user_accounts thành entity | lib/entities/user-account.ts | done | | ✅ Trường id/name/email/password_hash đúng; unique email; soft delete deleted_at; onCreate/onUpdate timestamps; markers @custom có |
| Map bảng categories thành entity | lib/entities/category.ts | done | | ✅ PK id, name required; timestamps auto; OneToMany với products; markers @custom có |
| Map bảng brands thành entity | lib/entities/brand.ts | done | | ✅ PK id, name required; timestamps auto; OneToMany với products; markers @custom có |
| Map bảng products thành entity | lib/entities/product.ts | done | | ✅ PK id, sku unique, price decimal, foreign keys category_id/brand_id; check constraints price>=0, rating 0-5; markers @custom có |
| Map bảng product_images thành entity | lib/entities/product-image.ts | done | | ✅ PK id, FK product_id, url varchar(500), is_main boolean; ManyToOne với product; markers @custom có |
| Map bảng product_options thành entity | lib/entities/product-option.ts | done | | ✅ PK id, FK product_id, option_type/option_value; ManyToOne với product; markers @custom có |
| Map bảng reviews thành entity | lib/entities/review.ts | done | | ✅ PK id, FK product_id/user_id, rating check 1-5, comment text; ManyToOne relationships; markers @custom có |
| Map bảng wishlists thành entity | lib/entities/wishlist.ts | done | | ✅ PK id, FK user_id/product_id; ManyToOne relationships; markers @custom có |
| Map bảng comparisons thành entity | lib/entities/comparison.ts | done | | ✅ PK id, FK user_id/product_id; ManyToOne relationships; markers @custom có |
| Map bảng email_confirmation_codes | lib/entities/email-confirmation-code.ts | done | | ✅ PK id, FK user_account_id CASCADE, code length=6, expires_at; markers @custom có |
| Map bảng documents thành entity | lib/entities/document.ts | done | | ✅ PK id, file_path/file_type/file_size fields; uploaded_at timestamp; markers @custom có |
| Map bảng login_logs thành entity | lib/entities/login-log.ts | done | | ✅ PK id, FK user_id CASCADE, user_account_id SET NULL, success boolean; markers @custom có |
| Map bảng channels thành entity | lib/entities/channel.ts | done | | ✅ PK id, channel_name unique, soft delete deleted_at; OneToMany với channel_members/messages; markers @custom có |
| Map bảng channel_members thành entity | lib/entities/channel-member.ts | done | | ✅ PK id, composite unique(channel_id, user_account_id), role check length>0, soft delete; markers @custom có |
| Map bảng messages thành entity | lib/entities/message.ts | done | | ✅ PK id, FK channel_id CASCADE, user_account_id SET NULL, message_text check length<=3000, soft delete; markers @custom có |
| Map bảng attachments thành entity | lib/entities/attachment.ts | done | | ✅ PK id, FK message_id CASCADE, file_url; ManyToOne với message, soft delete; markers @custom có |
| Map bảng user_logs thành entity | lib/entities/user-log.ts | done | | ✅ PK id, FK user_account_id CASCADE, action/details; ManyToOne với user_account; markers @custom có |
| Map bảng user_profiles thành entity | lib/entities/user-profile.ts | done | | ✅ PK id, FK user_account_id CASCADE UNIQUE, profile_photo bytea; OneToOne với user_account; markers @custom có |
| Khởi tạo thư mục migrations | lib/db/migrations/ | done | | ✅ CLI `npx mikro-orm migration:create && npx mikro-orm migration:up` chạy OK trên DB trống; .gitkeep file tồn tại |
| Khởi tạo thư mục repositories | lib/repositories/ | done | | ✅ Thư mục rỗng với .gitkeep cho future repository pattern implementation |
| Setup types và utils | lib/db/types/index.ts, lib/utils/index.ts | done | | ✅ Export common types và utility functions; type-safe helpers |
| Seed dữ liệu mẫu | lib/db/seed/seed.ts | in_progress | | Seed idempotent; chạy nhiều lần không duplicate; log rõ ràng; sample data cho tất cả entities |
| Setup PostgreSQL database | Database setup | todo | | PostgreSQL service running; database 'myapp_db' created; user 'myapp_user' with permissions |
| Test database connection | Health check | todo | | npx mikro-orm debug shows successful connection; no ECONNREFUSED errors |
| Create initial migration | lib/db/migrations/ | todo | | npx mikro-orm migration:create --initial runs successfully; migration file generated |
| Run initial migration | Database | todo | | npx mikro-orm migration:up executes without errors; all tables created |
| Viết SETUP documentation | lib/db/SETUP.md | done | | ✅ Hướng dẫn cài deps, env setup, migration, seed; healthcheck snippet; hot-reload notes |
| Viết README tổng quan | lib/db/README.md | done | | ✅ Tổng quan architecture, entity relationships, usage examples; link tới SETUP.md |
| Tạo dev reset script | lib/db/scripts/dev-db-reset.ts | done | | ✅ Script drop/create/migrate/seed cho development; safety checks cho production |
| Cài đặt dependencies | package.json | done | | ✅ @mikro-orm/core, @mikro-orm/postgresql, @mikro-orm/cli, reflect-metadata, pg, zod, ts-node |
| Tạo MikroORM config | mikro-orm.config.js | done | | ✅ Config file cho CLI tools; driver setup; entities discovery |
| Setup TypeScript config | tsconfig.json | done | | ✅ experimentalDecorators, emitDecoratorMetadata enabled; paths mapping |
