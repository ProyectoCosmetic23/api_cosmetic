const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pedidos = sequelize.define('pedidos', {
  id_pedido: {
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id_cliente'
    }
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id_empleado'
    }
  },
  numero_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo_pago: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado_pedido: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  total_pedido: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'pedidos',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pedidos_pkey",
      unique: true,
      fields: [
        { name: "id_pedido" },
      ]
    },
  ]
});

module.exports = Pedidos;