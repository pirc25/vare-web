const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '.env.local' });

console.log('🔗 Conectando a:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // Ver las queries SQL
});

// Definir todos los modelos
const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_usuario'
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  modelName: 'Usuario',
  tableName: 'usuario',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_cliente'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'identificacion'
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha_nacimiento'
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoDocumento: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tipo_documento'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  modelName: 'Cliente',
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_producto'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  precioCompra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_compra'
  },
  precioVenta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_venta'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  modelName: 'Producto',
  tableName: 'productos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const Venta = sequelize.define('Venta', {
  idVenta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_venta'
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_cliente',
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
  },
  fechaVenta: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_venta',
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  modelName: 'Venta',
  tableName: 'ventas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const DetalleVenta = sequelize.define('DetalleVenta', {
  idDetalleVenta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_detalle_venta'
  },
  idVenta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_venta',
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_producto',
  },
  pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vareAnterior: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vare_anterior'
  },
  vareActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vare_actual'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  modelName: 'DetalleVenta',
  tableName: 'detalle_ventas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Definir relaciones
const initRelations = () => {
  // Cliente -> Ventas
  Cliente.hasMany(Venta, { foreignKey: 'idCliente', as: 'ventas' });
  Venta.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' });

  // Usuario -> Ventas
  Usuario.hasMany(Venta, { foreignKey: 'idUsuario', as: 'ventas' });
  Venta.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

  // Venta -> DetalleVenta
  Venta.hasMany(DetalleVenta, { foreignKey: 'idVenta', as: 'detalles' });
  DetalleVenta.belongsTo(Venta, { foreignKey: 'idVenta', as: 'venta' });

  // Producto -> DetalleVenta
  Producto.hasMany(DetalleVenta, { foreignKey: 'idProducto', as: 'detallesVenta' });
  DetalleVenta.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });
};

async function initializeDatabase() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');

    // Inicializar relaciones
    initRelations();

    // Sincronizar modelos (crear tablas)
    console.log('🔄 Creando/actualizando tablas...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Todas las tablas han sido creadas exitosamente');

    // Crear datos de prueba
    console.log('🌱 Creando datos de prueba...');
    
    // Usuario admin
    const [adminUser] = await Usuario.findOrCreate({
      where: { usuario: 'admin' },
      defaults: {
        usuario: 'admin',
        email: 'admin@vare.com',
        password: 'admin123'
      }
    });
    console.log('👤 Usuario admin:', adminUser.usuario);

    // Usuario vendedor
    const [vendedor] = await Usuario.findOrCreate({
      where: { usuario: 'vendedor' },
      defaults: {
        usuario: 'vendedor',
        email: 'vendedor@vare.com',
        password: 'vendedor123'
      }
    });
    console.log('👤 Usuario vendedor:', vendedor.usuario);

    // Cliente de prueba
    const [cliente1] = await Cliente.findOrCreate({
      where: { email: 'cliente1@email.com' },
      defaults: {
        nombre: 'Juan Pérez',
        identificacion: '12345678',
        celular: '3001234567',
        fechaNacimiento: '1990-05-15',
        direccion: 'Calle 123 #45-67',
        tipoDocumento: 'CC',
        email: 'cliente1@email.com'
      }
    });
    console.log('👥 Cliente:', cliente1.nombre);

    // Cliente 2
    const [cliente2] = await Cliente.findOrCreate({
      where: { email: 'maria@email.com' },
      defaults: {
        nombre: 'María García',
        identificacion: '87654321',
        celular: '3009876543',
        fechaNacimiento: '1985-08-20',
        direccion: 'Avenida 456 #78-90',
        tipoDocumento: 'CC',
        email: 'maria@email.com'
      }
    });
    console.log('👥 Cliente:', cliente2.nombre);

    // Productos de prueba
    const productos = await Producto.bulkCreate([
      {
        nombre: 'Laptop Dell Inspiron',
        codigo: 'DELL001',
        precioCompra: 800.00,
        precioVenta: 1200.00,
        stock: 5
      },
      {
        nombre: 'Mouse Logitech',
        codigo: 'LOG001',
        precioCompra: 15.00,
        precioVenta: 25.00,
        stock: 20
      },
      {
        nombre: 'Teclado Mecánico',
        codigo: 'TEC001',
        precioCompra: 45.00,
        precioVenta: 75.00,
        stock: 15
      },
      {
        nombre: 'Monitor Samsung 24"',
        codigo: 'SAM001',
        precioCompra: 180.00,
        precioVenta: 280.00,
        stock: 8
      }
    ], { 
      ignoreDuplicates: true 
    });
    console.log('📦 Productos creados:', productos.length);

    // Venta de ejemplo
    const [venta] = await Venta.findOrCreate({
      where: { idCliente: cliente1.idCliente, idUsuario: adminUser.idUsuario },
      defaults: {
        idCliente: cliente1.idCliente,
        idUsuario: adminUser.idUsuario,
        fechaVenta: new Date(),
        total: 1225.00,
        estado: 'completada'
      }
    });

    if (venta) {
      // Detalles de venta
      await DetalleVenta.findOrCreate({
        where: { idVenta: venta.idVenta, idProducto: productos[0]?.idProducto || 1 },
        defaults: {
          idVenta: venta.idVenta,
          idProducto: productos[0]?.idProducto || 1,
          pedido: 1,
          vareAnterior: 5,
          vareActual: 4,
          total: 1200.00
        }
      });

      await DetalleVenta.findOrCreate({
        where: { idVenta: venta.idVenta, idProducto: productos[1]?.idProducto || 2 },
        defaults: {
          idVenta: venta.idVenta,
          idProducto: productos[1]?.idProducto || 2,
          pedido: 1,
          vareAnterior: 20,
          vareActual: 19,
          total: 25.00
        }
      });
    }

    console.log('💰 Venta de ejemplo creada');

    // Mostrar estadísticas
    const stats = {
      usuarios: await Usuario.count(),
      clientes: await Cliente.count(),
      productos: await Producto.count(),
      ventas: await Venta.count(),
      detalles: await DetalleVenta.count()
    };
    
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    console.log('========================');
    console.log(`👤 Usuarios: ${stats.usuarios}`);
    console.log(`👥 Clientes: ${stats.clientes}`);
    console.log(`📦 Productos: ${stats.productos}`);
    console.log(`💰 Ventas: ${stats.ventas}`);
    console.log(`📋 Detalles de venta: ${stats.detalles}`);
    
    console.log('\n🎉 ¡Base de datos inicializada correctamente!');
    console.log('\n🔑 CREDENCIALES DE PRUEBA:');
    console.log('Admin: usuario="admin", password="admin123"');
    console.log('Vendedor: usuario="vendedor", password="vendedor123"');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar inicialización
initializeDatabase();