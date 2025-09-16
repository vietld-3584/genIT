import { Entity, PrimaryKey, Property, OneToOne, Unique } from '@mikro-orm/core';
import { UserAccount } from './user-account';

@Entity({ tableName: 'user_profiles' })
export class UserProfile {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'bytea', nullable: true })
  profilePhoto?: Buffer;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships - CASCADE delete, unique constraint
  @OneToOne(() => UserAccount)
  userAccount!: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
