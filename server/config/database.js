const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL (Neon) Connected successfully!');
    
    // Sync models - creates missing tables only, no ALTER TABLE (safe for production)
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
  } catch (error) {
    console.error(' Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };