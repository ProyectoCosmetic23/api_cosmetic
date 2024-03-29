const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Orders = sequelize.define(
  "orders",
  {
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    order_state: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    return_state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    delivery_state: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    payment_state: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    total_order: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    observation_return: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Orders",
    tableName: "orders",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "orders_pkey",
        unique: true,
        fields: [{ name: "id_order" }],
      },
    ],
  }
);

module.exports = Orders;
