import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserAccount } from './user-account';

@Entity({ tableName: 'login_logs' })
export class LoginLog {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Property({ type: 'boolean' })
  success!: boolean;

  @Property({ type: 'varchar', length: 255, nullable: true })
  errorMessage?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  // Relationships - CASCADE for user_id, SET NULL for user_account_id
  @ManyToOne(() => UserAccount, { nullable: true })
  user?: UserAccount;

  @ManyToOne(() => UserAccount, { nullable: true })
  userAccount?: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
