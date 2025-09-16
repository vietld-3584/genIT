import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Message } from './message';

@Entity({ tableName: 'attachments' })
export class Attachment {
  @PrimaryKey()
  id!: number;

  // Relationships - CASCADE delete
  @Property({ type: 'varchar', length: 255 })
  fileUrl!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships - CASCADE delete, MikroORM tự động tạo foreign key
  @ManyToOne(() => Message)
  message!: Message;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
