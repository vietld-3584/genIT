// Import reflect-metadata for MikroORM decorators to work
import 'reflect-metadata';

// Re-export all entities for easy importing
export { UserAccount } from './user-account';
export { Category } from './category';
export { Brand } from './brand';
export { Product } from './product';
export { ProductImage } from './product-image';
export { ProductOption } from './product-option';
export { Review } from './review';
export { Wishlist } from './wishlist';
export { Comparison } from './comparison';
export { EmailConfirmationCode } from './email-confirmation-code';
export { Document } from './document';
export { LoginLog } from './login-log';
export { Channel } from './channel';
export { ChannelMember } from './channel-member';
export { Message } from './message';
export { Attachment } from './attachment';
export { UserLog } from './user-log';
export { UserProfile } from './user-profile';
