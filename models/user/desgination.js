const { Model,DataTypes } = require('sequelize')
const { designation } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')

class Designation extends Model {}

Designation.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
    },
  },
  {
    sequelize,
    tableName: designation.tableName,
    schema: designation.schema,
    underscored: false,
    timestamps: false,
    modelName: "designation",
  }
)

module.exports = Designation