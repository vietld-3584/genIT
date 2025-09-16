import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserAccount } from './user-account';

@Entity({ tableName: 'email_confirmation_codes' })
export class EmailConfirmationCode {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 6 })
  code!: string;

  @Property({ type: 'timestamp' })
  expiresAt!: Date;

  @Property({ type: 'boolean', default: false })
  isUsed: boolean = false;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'timestamp', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  // Relationships - ON DELETE CASCADE
  @ManyToOne(() => UserAccount)
  userAccount!: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
