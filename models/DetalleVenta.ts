import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/database';

interface DetalleVentaAttributes {
  idDetalleVenta?: number;
  idVenta: number;
  idProducto: number;
  pedido: number;
  vareAnterior: number;
  vareActual: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class DetalleVenta extends Model<DetalleVentaAttributes> implements DetalleVentaAttributes {
  public idDetalleVenta!: number;
  public idVenta!: number;
  public idProducto!: number;
  public pedido!: number;
  public vareAnterior!: number;
  public vareActual!: number;
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Un detalle pertenece a una venta
    DetalleVenta.belongsTo(models.Venta, { 
      foreignKey: 'idVenta', 
      as: 'venta' 
    });
    
    // Un detalle pertenece a un producto
    DetalleVenta.belongsTo(models.Producto, { 
      foreignKey: 'idProducto', 
      as: 'producto' 
    });
  }
}

DetalleVenta.init(
  {
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
      references: {
        model: 'ventas',
        key: 'id_venta'
      }
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_producto',
      references: {
        model: 'productos',
        key: 'id_producto'
      }
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
  },
  {
    sequelize,
    modelName: 'DetalleVenta',
    tableName: 'detalle_ventas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default DetalleVenta;