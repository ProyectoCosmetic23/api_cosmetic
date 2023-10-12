const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_venta', {
    id_detalle_venta: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'id_venta'
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
    tipo_pago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_venta: {
      type: DataTypes.DECIMAL,
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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_producto: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'detalle_venta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalle_venta_pkey",
        unique: true,
        fields: [
          { name: "id_detalle_venta" },
        ]
      },
    ]
  });
};
