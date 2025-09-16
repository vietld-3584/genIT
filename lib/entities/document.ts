import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'documents' })
export class Document {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  filePath?: string;

  @Property({ type: 'varchar', length: 20, nullable: true })
  fileType?: string;

  @Property({ type: 'int', nullable: true })
  fileSize?: number;

  @Property({ type: 'timestamp', nullable: true })
  uploadedAt?: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
