const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Promotion = require('./Promotion');
const Message = require('./Message');
const ContentBlock = require('./ContentBlock');
const NewsletterSubscription = require('./NewsletterSubscription');
const CustomizationOption = require('./CustomizationOption');
const Category = require('./Category');
const PromoBanner = require('./PromoBanner');

// Define associations
User.hasMany(Order, {
  foreignKey: 'customerId',
  as: 'orders',
});

Order.belongsTo(User, {
  foreignKey: 'customerId',
  as: 'customer',
});

Promotion.hasMany(Order, {
  foreignKey: 'promotionId',
  as: 'orders',
  onDelete: 'SET NULL',
});

Order.belongsTo(Promotion, {
  foreignKey: 'promotionId',
  as: 'promotion',
});

// Message associations
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });
Message.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Order.hasMany(Message, { foreignKey: 'orderId', as: 'Messages' });

// Content Management Associations
User.hasMany(ContentBlock, {
  foreignKey: 'lastUpdatedBy',
  as: 'contentBlocksUpdated',
  onDelete: 'SET NULL',
});

ContentBlock.belongsTo(User, {
  foreignKey: 'lastUpdatedBy',
  as: 'updatedBy',
});

module.exports = {
  User,
  Product,
  Order,
  Promotion,
  Message,
  ContentBlock,
  NewsletterSubscription,
  CustomizationOption,
  Category,
  PromoBanner,
};
