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
    allowNull: false,
    references: {
      model: 'categorias_productos',
      key: 'id_categoria'
    }
  },
  nombre_producto: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_maximo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_costo: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  precio_venta: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  ganancia: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  fecha_creacion_producto: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado_producto: {
    type: DataTypes.STRING(15),
    allowNull: true
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