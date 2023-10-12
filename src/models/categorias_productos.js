const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categorias_productos', {
    id_categoria: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_categoria: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "categorias_productos_nombre_categoria_key"
    },
    estado_categoria: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    observacion_categoria: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fecha_creacion_categoria: {
      type: DataTypes.DATE,
      allowNull: true
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
};
