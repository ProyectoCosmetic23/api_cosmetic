const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ventas', {
    id_venta: {
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
    numero_factura: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado_venta: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    tipo_pago: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    total_venta: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ventas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ventas_pkey",
        unique: true,
        fields: [
          { name: "id_venta" },
        ]
      },
    ]
  });
};
