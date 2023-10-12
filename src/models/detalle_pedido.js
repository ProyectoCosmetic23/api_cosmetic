const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_pedido', {
    id_detalle_pedido: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id_pedido'
      }
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
    fecha_pedido: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numero_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_pago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_producto'
      }
    },
    cantidad_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_producto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'detalle_pedido',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalle_pedido_pkey",
        unique: true,
        fields: [
          { name: "id_detalle_pedido" },
        ]
      },
    ]
  });
};
