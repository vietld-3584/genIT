import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from './product';

@Entity({ tableName: 'brands' })
export class Brand {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 100 })
  name!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships
  @OneToMany(() => Product, product => product.brand, { nullable: true })
  products = new Collection<Product>(this);

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
