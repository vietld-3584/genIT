import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Product } from './product';

@Entity({ tableName: 'product_images' })
export class ProductImage {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 500 })
  url!: string;

  @Property({ type: 'boolean', default: false })
  isMain: boolean = false;

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
