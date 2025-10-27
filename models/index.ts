import sequelize from '@/lib/database';
import Producto from './Producto';
import Cliente from './Cliente';    
import Venta from './Venta';    
import DetalleVenta from './DetalleVenta';
import Usuario from './usuario';
// Objeto con todos los modelos
const models = {
  Usuario,
  sequelize,
  Producto,
  Cliente,
  Venta,
  DetalleVenta,
  
    }   ;
    
    // Inicializar todas las relaciones automáticamente
const initModels = () => {
  Object.values(models).forEach((model: any) => {
    if (model.associate && typeof model.associate === 'function') {
      model.associate(models);
    }
  });
};

// Ejecutar inicialización de relaciones
initModels();

// Exportaciones individuales
export {
    Usuario,
  sequelize,
  Producto,
  Cliente,
  Venta,
  DetalleVenta,
  
};

// Exportación por defecto
export default models;