import { Entity, PrimaryKey, Property, OneToMany, OneToOne, Collection, Enum, Unique } from '@mikro-orm/core';
import { Review } from './review';
import { Wishlist } from './wishlist';
import { Comparison } from './comparison';
import { EmailConfirmationCode } from './email-confirmation-code';
import { LoginLog } from './login-log';
import { ChannelMember } from './channel-member';
import { Message } from './message';
import { UserLog } from './user-log';
import { UserProfile } from './user-profile';

@Entity({ tableName: 'user_accounts' })
export class UserAccount {
  @PrimaryKey({ type: 'int' })
  id!: number;

  @Property({ type: 'varchar', length: 64 })
  name!: string;

  @Property({ type: 'varchar', length: 100, nullable: true })
  title?: string;

  @Property({ type: 'bytea', nullable: true })
  avatarImage?: Buffer;

  @Property({ type: 'varchar', length: 255 })
  @Unique()
  email!: string;

  @Property({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relationships
  @OneToMany(() => Review, review => review.userAccount, { nullable: true })
  reviews = new Collection<Review>(this);

  @OneToMany(() => Wishlist, wishlist => wishlist.user)
  wishlists = new Collection<Wishlist>(this);

  @OneToMany(() => Comparison, comparison => comparison.userAccount)
  comparisons = new Collection<Comparison>(this);

  @OneToMany(() => EmailConfirmationCode, code => code.userAccount)
  emailConfirmationCodes = new Collection<EmailConfirmationCode>(this);

  @OneToMany(() => LoginLog, log => log.userAccount, { nullable: true })
  loginLogs = new Collection<LoginLog>(this);

  @OneToMany(() => ChannelMember, member => member.userAccount)
  channelMemberships = new Collection<ChannelMember>(this);

  @OneToMany(() => Message, message => message.userAccount, { nullable: true })
  messages = new Collection<Message>(this);

  @OneToMany(() => UserLog, log => log.userAccount)
  userLogs = new Collection<UserLog>(this);

  @OneToOne(() => UserProfile, profile => profile.userAccount, { nullable: true })
  profile?: UserProfile;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
