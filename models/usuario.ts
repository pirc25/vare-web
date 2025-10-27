import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/database';

interface UsuarioAttributes {
  idUsuario?: number;
  usuario: string;
  email: string;
  password?: string;
  created_at?: Date;  // ✅ CAMBIO: created_at
  updated_at?: Date;  // ✅ CAMBIO: updated_at

}

class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
  public idUsuario!: number;
  public usuario!: string;
  public email!: string;
  public password!: string;
  public readonly created_at!: Date;  // ✅ CAMBIO: created_at
  public readonly updated_at!: Date;  // ✅ CAMBIO: updated_at


    static associate(models: any) {
    // Un usuario puede registrar muchas ventas
    Usuario.hasMany(models.Venta, {
      foreignKey: 'idUsuario',
      as: 'ventas'
    });
  }
}
// ...existing code...

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_usuario'
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional según tu interface
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// ...existing code...

export default Usuario;