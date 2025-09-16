import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserAccount } from './user-account';

@Entity({ tableName: 'user_logs' })
export class UserLog {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 50 })
  action!: string;

  @Property({ type: 'json', nullable: true })
  details?: object;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt!: Date;

  // Relationships - MikroORM tự động tạo foreign key
  @ManyToOne(() => UserAccount)
  userAccount!: UserAccount;

  // @custom:start - Add custom methods and computed properties here
  // @custom:end
}
