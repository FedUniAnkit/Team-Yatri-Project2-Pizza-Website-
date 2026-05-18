const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

class NewsletterSubscription extends Model {}

NewsletterSubscription.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  unsubscribeToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'NewsletterSubscription',
  timestamps: true,
  hooks: {
    beforeCreate: (subscription) => {
      subscription.unsubscribeToken = crypto.randomBytes(32).toString('hex');
    },
  },
});

module.exports = NewsletterSubscription;
