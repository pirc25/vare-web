import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/database';

interface ClienteAttributes {
  idCliente?: number;
  nombre: string;
  identifacion: string;
  celular: string;
  fechaNacimiento: Date;
  direccion: string;
  tipoDocumento?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Cliente extends Model<ClienteAttributes> implements ClienteAttributes {
  public idCliente!: number;
  public nombre!: string;
  public identifacion!: string;
  public celular!: string;
  public fechaNacimiento!: Date;
  public direccion!: string;
  public tipoDocumento!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Un cliente puede tener muchas ventas
    Cliente.hasMany(models.Venta, { 
      foreignKey: 'idCliente', 
      as: 'ventas' 
    });
  }
}

Cliente.init(
  {
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
    identifacion: {
      type: DataTypes.STRING,
      allowNull: false,
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
      validate: {
        isEmail: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true, // Esto hace que Sequelize maneje automáticamente created_at y updated_at
    createdAt: 'created_at', // Mapea createdAt a created_at
    updatedAt: 'updated_at', // Mapea updatedAt a updated_at
  }
);


export default Cliente;