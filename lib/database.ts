import { Sequelize } from 'sequelize';
import pg from 'pg';

// Cargar variables de entorno explícitamente
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

// Verificar que la URL de la base de datos esté disponible
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL no está definida en .env.local');
  console.log('Variables disponibles:', {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME
  });
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

console.log('🔗 Conectando a base de datos:', databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
    dialectModule: pg,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

export default sequelize;