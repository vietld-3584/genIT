import { faker } from '@faker-js/faker';
import { getEM } from '../../../../lib/db/client';
import { Channel } from '../../../../lib/entities/channel';

export interface BuildChannelOptions {
  channelName?: string;
  description?: string;
}

export const buildChannelAttrs = (opts: BuildChannelOptions = {}) => {
  return {
    channelName: (opts.channelName ?? faker.commerce.department()).slice(0,50),
    description: opts.description?.slice(0,255) ?? faker.lorem.sentence(),
  };
};

export const createChannel = async (opts: BuildChannelOptions = {}) => {
  const em = getEM();
  const attrs: any = buildChannelAttrs(opts);
  const channel = em.create(Channel, attrs);
  await em.persistAndFlush(channel);
  return channel;
};
