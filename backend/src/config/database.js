const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for local development, MySQL for production
const isDevelopment = process.env.NODE_ENV !== 'production';

let sequelize;

if (isDevelopment && !process.env.USE_MYSQL) {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('Using SQLite database for development');
} else {
  // MySQL for production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
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
  console.log('Using MySQL database');
}

module.exports = sequelize;
