import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Unique } from '@mikro-orm/core';
import { Category } from './category';
import { Brand } from './brand';
import { ProductImage } from './product-image';
import { ProductOption } from './product-option';
import { Review } from './review';
import { Wishlist } from './wishlist';
import { Comparison } from './comparison';

@Entity({ tableName: 'products' })
export class Product {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'varchar', length: 100 })
  @Unique()
  sku!: string;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  originalPrice?: number;

  @Property({ type: 'int', nullable: true })
  discountPercent?: number;

  @Property({ type: 'varchar', length: 50 })
  availability!: string;

  @Property({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Property({ type: 'int', nullable: true })
  reviewCount?: number;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => Category)
  category!: Category;

  @ManyToOne(() => Brand, { nullable: true })
  brand?: Brand;

  @OneToMany(() => ProductImage, image => image.product)
  images = new Collection<ProductImage>(this);

  @OneToMany(() => ProductOption, option => option.product)
  options = new Collection<ProductOption>(this);

  @OneToMany(() => Review, review => review.product)
  reviews = new Collection<Review>(this);

  @OneToMany(() => Wishlist, wishlist => wishlist.product)
  wishlists = new Collection<Wishlist>(this);

  @OneToMany(() => Comparison, comparison => comparison.product)
  comparisons = new Collection<Comparison>(this);

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
