import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Product } from './product';
import { UserAccount } from './user-account';

@Entity({ tableName: 'reviews' })
export class Review {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'smallint' })
  rating!: number;

  @Property({ type: 'text', nullable: true })
  comment?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships - MikroORM tự động tạo foreign key
  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => UserAccount)
  userAccount!: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
