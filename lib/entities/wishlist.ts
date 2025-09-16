import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserAccount } from './user-account';
import { Product } from './product';

@Entity({ tableName: 'wishlists' })
export class Wishlist {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships - MikroORM tự động tạo foreign key
  @ManyToOne(() => UserAccount)
  user!: UserAccount;

  @ManyToOne(() => Product)
  product!: Product;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
