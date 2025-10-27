import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/database';

interface ProductoAttributes {
  idProducto?: number;
  nombre: string;
  codigo: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Producto extends Model<ProductoAttributes> implements ProductoAttributes {
  public idProducto!: number;
  public nombre!: string;
  public codigo!: string;
  public precioCompra!: number;
  public precioVenta!: number;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

     static associate(models: any) {
    // Un producto puede aparecer en muchos detalles de venta
    Producto.hasMany(models.DetalleVenta, { 
      foreignKey: 'idProducto', 
      as: 'detallesVenta' 
    });
  }
}

Producto.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Producto;