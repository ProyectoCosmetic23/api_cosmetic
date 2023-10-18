const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../config/sequelize');

const Categoria = sequelize.define('categorias_productos', {
  id_categoria: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nombre_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: "categorias_productos_nombre_categoria_key"
  },
  estado_categoria: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo",
    validate: {
      isIn: {
        args: [["Activo", "Inactivo"]],
        msg: "El estado de la categoría debe ser 'Activo' o 'Inactivo'",
        }
      }
    },
  observacion_categoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_creacion_categoria: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: NOW()
  }
}, {
  sequelize,
  tableName: 'categorias_productos',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "categorias_productos_nombre_categoria_key",
      unique: true,
      fields: [
        { name: "nombre_categoria" },
      ]
    },
    {
      name: "categorias_productos_pkey",
      unique: true,
      fields: [
        { name: "id_categoria" },
      ]
    },
  ]
});

module.exports = Categoria;
