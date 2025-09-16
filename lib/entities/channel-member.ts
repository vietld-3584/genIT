import { Entity, PrimaryKey, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { Channel } from './channel';
import { UserAccount } from './user-account';

@Entity({ tableName: 'channel_members' })
@Unique({ properties: ['channel', 'userAccount'] })
export class ChannelMember {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 50 })
  role!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships - CASCADE delete, MikroORM tự động tạo foreign keys
  @ManyToOne(() => Channel)
  channel!: Channel;

  @ManyToOne(() => UserAccount)
  userAccount!: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
