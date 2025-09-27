import { faker } from '@faker-js/faker';
import { getEM } from '../../../../lib/db/client';
import { UserAccount } from '../../../../lib/entities/user-account';
import * as crypto from 'crypto';

export interface BuildUserOptions {
  email?: string;
  name?: string;
  password?: string; // plain password for future auth when implemented
  title?: string;
}

export const buildUserAttrs = (opts: BuildUserOptions = {}) => {
  return {
    name: opts.name ?? faker.person.fullName().slice(0,64),
    email: opts.email ?? faker.internet.email().toLowerCase(),
    passwordHash: crypto.createHash('sha256').update(opts.password ?? 'Password123!').digest('hex'),
    title: opts.title?.slice(0,100),
  };
};

export const createUser = async (opts: BuildUserOptions = {}) => {
  const em = getEM();
  // MikroORM will populate createdAt/updatedAt hooks; cast to any to bypass compile-time requirement
  const attrs: any = buildUserAttrs(opts);
  const user = em.create(UserAccount, attrs);
  await em.persistAndFlush(user);
  return user;
};
