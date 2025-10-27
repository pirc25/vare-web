import sequelize from './database';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) {
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    
    isInitialized = true;
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}