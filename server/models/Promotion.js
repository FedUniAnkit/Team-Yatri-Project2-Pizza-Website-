const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Promotion code is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Discount type is required'
      }
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Discount amount must be non-negative'
      }
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Usage limit must be non-negative'
      }
    }
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Usage count must be non-negative'
      }
    }
  },
  minimumOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Minimum order amount must be non-negative'
      }
    }
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Maximum discount amount must be non-negative'
      }
    }
  },
}, {
  timestamps: true,
  tableName: 'Promotions',
  validate: {
    datesCheck() {
      if (this.startDate && this.endDate && this.startDate >= this.endDate) {
        throw new Error('End date must be after start date.');
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['isActive', 'startDate', 'endDate']
    }
  ]
});

module.exports = Promotion;
