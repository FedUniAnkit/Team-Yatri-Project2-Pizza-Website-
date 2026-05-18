const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PromoBanner = sequelize.define('PromoBanner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  promoCode: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [0, 50]
    }
  },
  style: {
    type: DataTypes.ENUM('gradient', 'festive', 'elegant', 'fresh'),
    defaultValue: 'gradient'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [0, 500]
    }
  },
  ctaText: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [0, 80]
    }
  },
  ctaLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [0, 255]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['isActive']
    }
  ]
});

module.exports = PromoBanner;
