import { faker } from '@faker-js/faker';
import { getEM } from '../../../../lib/db/client';
import { Message } from '../../../../lib/entities/message';
import { Channel } from '../../../../lib/entities/channel';
import { UserAccount } from '../../../../lib/entities/user-account';

export interface BuildMessageOptions {
  channel: Channel;
  user?: UserAccount;
  messageText?: string;
}

export const buildMessageAttrs = (opts: BuildMessageOptions) => {
  return {
    messageText: (opts.messageText ?? faker.lorem.sentence()).slice(0,1000),
    channel: opts.channel,
    userAccount: opts.user,
  };
};

export const createMessage = async (opts: BuildMessageOptions) => {
  const em = getEM();
  const attrs: any = buildMessageAttrs(opts);
  const message = em.create(Message, attrs);
  await em.persistAndFlush(message);
  return message;
};
