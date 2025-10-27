import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/database';

interface VentaAttributes {
  idVenta?: number;
  idCliente: number;
  idUsuario?: number;
  fechaVenta: Date;
  total: number;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Venta extends Model<VentaAttributes> implements VentaAttributes {
  public idVenta!: number;
  public idCliente!: number;
  public idUsuario!: number;
  public fechaVenta!: Date;
  public total!: number;
  public estado!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

static associate(models: any) {
    // Una venta pertenece a un cliente
    Venta.belongsTo(models.Cliente, { 
      foreignKey: 'idCliente', 
      as: 'cliente' 
    });
    
    // Una venta es registrada por un usuario
    Venta.belongsTo(models.Usuario, { 
      foreignKey: 'idUsuario', 
      as: 'usuario' 
    });
    
    // Una venta puede tener muchos detalles
    Venta.hasMany(models.DetalleVenta, { 
      foreignKey: 'idVenta', 
      as: 'detalles' 
    });
  }
}

Venta.init(
  {
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
      references: {
        model: 'clientes',
        key: 'id_cliente'
      }
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
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: [['pendiente', 'completada', 'cancelada']]
      }
    },
  },
  {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Venta;