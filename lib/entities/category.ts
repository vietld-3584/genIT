import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from './product';

@Entity({ tableName: 'categories' })
export class Category {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 100 })
  name!: string;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relationships
  @OneToMany(() => Product, product => product.category)
  products = new Collection<Product>(this);

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
