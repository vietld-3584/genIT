import { createUser, createChannel, createMessage } from '../factories';

export const seedBasicUser = async () => {
  return await createUser({});
};

export const seedChannelWithMember = async () => {
  const user = await seedBasicUser();
  const channel = await createChannel({});
  // TODO: create ChannelMember entity linking once route logic relies on it
  return { user, channel };
};

export const seedChannelWithMessages = async (count = 3) => {
  const { user, channel } = await seedChannelWithMember();
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push(await createMessage({ channel, user }));
  }
  return { user, channel, messages };
};
