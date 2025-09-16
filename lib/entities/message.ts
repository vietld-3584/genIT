import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Channel } from './channel';
import { UserAccount } from './user-account';
import { Attachment } from './attachment';

@Entity({ tableName: 'messages' })
export class Message {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  messageText!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships - MikroORM tự động tạo foreign keys
  @ManyToOne(() => Channel)
  channel!: Channel;

  @ManyToOne(() => UserAccount, { nullable: true })
  userAccount?: UserAccount;

  @OneToMany(() => Attachment, attachment => attachment.message)
  attachments = new Collection<Attachment>(this);

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
