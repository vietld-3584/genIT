# Database Layer Setup Guide

## Prerequisites

Đảm bảo bạn đã cài đặt Node.js và PostgreSQL.

## 1. Install Dependencies

Cài đặt các dependencies cần thiết:

```bash
npm install @mikro-orm/core @mikro-orm/postgresql @mikro-orm/cli reflect-metadata pg zod
npm install -D @types/pg tsx
```

## 2. Environment Configuration

Tạo file `.env.local` (KHÔNG commit file này):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USER=myapp_user
DB_PASSWORD=myapp_password

# Environment
NODE_ENV=development
```

### Production Environment

Cho production, thêm các biến môi trường sau:

```env
DB_HOST=your_production_host
DB_PORT=5432
DB_NAME=production_db_name
DB_USER=production_user
DB_PASSWORD=secure_production_password
NODE_ENV=production
```

## 3. Database Setup

### Tạo Database và User (PostgreSQL)

```sql
-- Connect as postgres superuser
CREATE USER myapp_user WITH PASSWORD 'myapp_password';
CREATE DATABASE myapp_db OWNER myapp_user;
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
```

## 4. MikroORM Configuration

Tạo file `mikro-orm.config.ts` ở root project:

```typescript
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { env } from './lib/config/env';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  dbName: env.DB_NAME,
  entities: ['./lib/entities/**/*.ts'],
  entitiesTs: ['./lib/entities/**/*.ts'],
  migrations: {
    path: './lib/db/migrations',
    pattern: /^[\w-]+\d+\.ts$/,
  },
  debug: env.NODE_ENV === 'development',
});
```

## 5. Migration Commands

### Khởi tạo và tạo migration đầu tiên:

```bash
# Tạo migration từ entities hiện tại
npx mikro-orm migration:create --initial

# Chạy migrations
npx mikro-orm migration:up

# Xem status migrations
npx mikro-orm migration:list
```

### Migration workflow thông thường:

```bash
# Tạo migration mới sau khi sửa entities
npx mikro-orm migration:create

# Chạy migrations chưa được thực thi
npx mikro-orm migration:up

# Rollback migration gần nhất (nếu cần)
npx mikro-orm migration:down
```

## 6. Seeding Data

Chạy seed để tạo dữ liệu mẫu:

```bash
# Sử dụng tsx để chạy TypeScript trực tiếp
npx tsx lib/db/seed/seed.ts

# Hoặc compile và chạy
npm run build
node dist/lib/db/seed/seed.js
```

## 7. Database Health Check

Test kết nối database:

```typescript
import { checkDatabaseConnection } from './lib/db/client';

const testConnection = async () => {
  const isHealthy = await checkDatabaseConnection();
  console.log('Database health:', isHealthy ? 'OK' : 'FAILED');
};

testConnection();
```

## 8. Hot Reload Integration

Trong Next.js API routes hoặc middleware, sử dụng:

```typescript
import { RequestContext } from '@mikro-orm/core';
import { getORM, getEM } from './lib/db/client';

export default async function handler(req, res) {
  const orm = await getORM();
  
  await RequestContext.create(orm.em, async () => {
    const em = getEM(); // Gets EntityManager from RequestContext
    // Your database operations here
  });
}
```

## 9. Troubleshooting

### Common Issues

1. **Connection Refused Error**: Kiểm tra PostgreSQL service đang chạy
2. **Authentication Failed**: Xác minh credentials trong `.env.local`
3. **Migration Errors**: Kiểm tra schema conflicts và foreign key constraints
4. **Hot Reload Issues**: Đảm bảo sử dụng `RequestContext` trong API routes

### Debug Mode

Bật debug logs trong development:

```typescript
// Trong mikro-orm.config.ts
export default defineConfig({
  debug: ['query', 'query-params'], // Log SQL queries
  // ... other config
});
```

## 10. Production Deployment

### Environment Variables

Đảm bảo set đúng production environment variables:

- `DB_HOST`: Production database host
- `DB_PORT`: Database port (thường 5432)
- `DB_NAME`: Production database name  
- `DB_USER`: Database user với quyền phù hợp
- `DB_PASSWORD`: Secure password
- `NODE_ENV=production`

### Migration trong Production

```bash
# Chỉ chạy migration, không seed
npx mikro-orm migration:up

# Verify migration status
npx mikro-orm migration:list
```

### Connection Pooling

Cho production, có thể cấu hình connection pooling:

```typescript
// mikro-orm.config.ts
export default defineConfig({
  pool: {
    min: 2,
    max: 10,
  },
  // ... other config
});
```

## 11. Backup and Restore

### Backup

```bash
pg_dump -h localhost -U myapp_user myapp_db > backup.sql
```

### Restore

```bash
psql -h localhost -U myapp_user myapp_db < backup.sql
```

---

**⚠️ Lưu ý quan trọng:**
- KHÔNG commit file `.env.local` vào git
- Sử dụng connection pooling trong production
- Luôn test migrations trên staging trước khi deploy production
- Backup database trước khi chạy migrations trong production
