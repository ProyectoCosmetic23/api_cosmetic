const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('devoluciones', {
    id_devolucion: {
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
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_producto'
      }
    },
    fecha_devolucion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cantidad_devuelta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor_devolucion: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    estado_producto_devuelto: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    estado_producto_proveedor: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'devoluciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "devoluciones_pkey",
        unique: true,
        fields: [
          { name: "id_devolucion" },
        ]
      },
    ]
  });
};
