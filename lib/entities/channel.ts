import { Entity, PrimaryKey, Property, OneToMany, Collection, Unique } from '@mikro-orm/core';
import { ChannelMember } from './channel-member';
import { Message } from './message';

@Entity({ tableName: 'channels' })
export class Channel {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 50 })
  @Unique()
  channelName!: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  iconUrl?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships
  @OneToMany(() => ChannelMember, member => member.channel)
  members = new Collection<ChannelMember>(this);

  @OneToMany(() => Message, message => message.channel)
  messages = new Collection<Message>(this);

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
