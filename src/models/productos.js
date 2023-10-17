const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Productos = sequelize.define('productos', {
  id_producto: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categorias_productos',
      key: 'id_categoria'
    }
  },
  nombre_producto: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock_maximo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  precio_costo: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  precio_venta: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  ganancia: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  fecha_creacion_producto: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado_producto: {
    type: DataTypes.STRING(15),
    allowNull: true,
    defaultValue: "Activo"
  },
  observacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'productos',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "productos_pkey",
      unique: true,
      fields: [
        { name: "id_producto" },
      ]
    },
  ]
});

module.exports = Productos;