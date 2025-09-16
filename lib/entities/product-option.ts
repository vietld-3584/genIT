import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Product } from './product';

@Entity({ tableName: 'product_options' })
export class ProductOption {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 50 })
  optionType!: string;

  @Property({ type: 'varchar', length: 100 })
  optionValue!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships - MikroORM tự động tạo foreign key
  @ManyToOne(() => Product)
  product!: Product;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
