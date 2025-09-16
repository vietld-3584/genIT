# Database Layer Architecture

## Overview

Đây là database layer cho Next.js application sử dụng **MikroORM** với **PostgreSQL**. Layer này cung cấp type-safe database operations với support cho migrations, seeding, và relationship management.

## Architecture Components

### 🗂️ Directory Structure

```
lib/
├── config/
│   └── env.ts                 # Environment validation với Zod
├── db/
│   ├── client.ts             # MikroORM singleton setup
│   ├── migrations/           # Database migrations
│   ├── seed/
│   │   └── seed.ts          # Idempotent seeding logic
│   ├── types/
│   │   └── index.ts         # Common DB types
│   ├── SETUP.md             # Detailed setup instructions
│   └── README.md            # This file
├── entities/                 # Entity definitions (one per table)
│   ├── user-account.ts
│   ├── category.ts
│   ├── brand.ts
│   ├── product.ts
│   └── ...
├── logging/
│   └── logger.ts            # Structured logging
├── repositories/            # Future repository pattern implementation
└── utils/
    └── index.ts            # Database utility functions
```

## 🏗️ Entity Relationships

### Core Entities

#### User Management
- **UserAccount**: Main user profile và authentication
- **UserProfile**: Extended profile với photo (OneToOne với UserAccount)  
- **UserLog**: Audit log cho user actions (ManyToOne với UserAccount)
- **EmailConfirmationCode**: Email verification codes (ManyToOne CASCADE)
- **LoginLog**: Sign-in attempt tracking (SET NULL relationships)

#### Product Catalog
- **Category**: Product classification (OneToMany với Products)
- **Brand**: Product brand information (OneToMany với Products)
- **Product**: Main catalog (ManyToOne với Category/Brand, OneToMany với Images/Options/Reviews)
- **ProductImage**: Product photos (ManyToOne với Product)
- **ProductOption**: Selectable options (ManyToOne với Product)

#### User Interactions
- **Review**: Product reviews (ManyToOne với Product/User)
- **Wishlist**: User favorites (ManyToOne với User/Product)
- **Comparison**: Product comparison lists (ManyToOne với User/Product)

#### Communication System
- **Channel**: Communication groups (OneToMany với Members/Messages)
- **ChannelMember**: User membership trong channels (composite unique constraint)
- **Message**: Chat messages (ManyToOne với Channel/User, OneToMany với Attachments)
- **Attachment**: Message files (ManyToOne CASCADE với Message)

#### Document Management
- **Document**: File uploads và metadata

## 🔗 Key Relationships & Constraints

### Foreign Key Constraints
```sql
-- Cascade Deletes (parent deletion removes children)
email_confirmation_codes.user_account_id -> user_accounts.id ON DELETE CASCADE
channel_members.channel_id -> channels.id ON DELETE CASCADE  
channel_members.user_account_id -> user_accounts.id ON DELETE CASCADE
messages.channel_id -> channels.id ON DELETE CASCADE
attachments.message_id -> messages.id ON DELETE CASCADE
user_logs.user_account_id -> user_accounts.id ON DELETE CASCADE
user_profiles.user_account_id -> user_accounts.id ON DELETE CASCADE

-- Set Null (preserve records but remove reference)
messages.user_account_id -> user_accounts.id ON DELETE SET NULL
login_logs.user_account_id -> user_accounts.id ON DELETE SET NULL
```

### Unique Constraints
- `user_accounts.email`: Duy nhất email addresses
- `products.sku`: Duy nhất product SKUs  
- `channels.channel_name`: Duy nhất channel names
- `channel_members(channel_id, user_account_id)`: Composite unique
- `user_profiles.user_account_id`: OneToOne relationship

### Check Constraints
- Email format validation: `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`
- Price constraints: `price >= 0`, `original_price >= 0`
- Rating range: `rating >= 0 AND rating <= 5`  
- Discount percentage: `discount_percent >= 0 AND discount_percent <= 100`
- Review rating: `rating >= 1 AND rating <= 5`
- Message length: `char_length(message_text) <= 3000`
- Confirmation code length: `char_length(code) = 6`
- Role validation: `char_length(role) > 0`

## 📊 Composite Indexes

Performance optimizations cho common query patterns:

```sql
-- Product filtering
CREATE INDEX idx_products_category_brand ON products(category_id, brand_id);

-- User authentication  
CREATE INDEX idx_login_logs_user_account_id_success ON login_logs(user_account_id, success);

-- Product reviews
CREATE INDEX idx_reviews_product_id_rating ON reviews(product_id, rating);

-- Channel management
CREATE INDEX idx_channel_members_channel_id_role ON channel_members(channel_id, role);

-- Partial index for active confirmation codes
CREATE INDEX idx_email_confirmation_codes_is_used ON email_confirmation_codes(is_used) 
WHERE is_used = false;
```

## 🔄 Soft Delete Support

Các entities hỗ trợ soft delete (với `deleted_at` timestamp):

- `UserAccount`
- `Channel`
- `ChannelMember`
- `Message` 
- `Attachment`

## 🛠️ Usage Examples

### Basic Entity Operations

```typescript
import { getEM } from './lib/db/client';
import { UserAccount, Product } from './lib/entities';

// Create và persist entity
const em = getEM();
const user = em.create(UserAccount, {
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password'
});
await em.persistAndFlush(user);

// Query với relationships
const products = await em.find(Product, {}, {
  populate: ['category', 'brand', 'images']
});

// Complex queries
const activeChannels = await em.find(Channel, {
  deletedAt: null
}, {
  populate: ['members.userAccount']
});
```

### Transaction Usage

```typescript
await em.transactional(async (em) => {
  const user = em.create(UserAccount, userData);
  const profile = em.create(UserProfile, { userAccount: user });
  
  await em.persistAndFlush([user, profile]);
});
```

## 🔍 Custom Markers

Các entities có `@custom:start` và `@custom:end` markers cho:

- Business logic methods
- Computed properties  
- Custom validations
- Entity-specific utilities

Điều này đảm bảo **idempotent scaffolding** - có thể re-generate mà không mất custom code.

## 📝 Next Steps

1. **Repository Pattern**: Implement repositories trong `lib/repositories/`
2. **Service Layer**: Business logic layer trên repositories  
3. **API Integration**: Kết nối với Next.js API routes
4. **Caching**: Redis integration cho performance
5. **Full-text Search**: PostgreSQL text search hoặc external search engine

## 🔗 References

- [MikroORM Documentation](https://mikro-orm.io/)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Setup Guide](./SETUP.md) - Chi tiết installation và configuration
