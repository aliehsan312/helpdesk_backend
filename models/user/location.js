const { Model,DataTypes } = require('sequelize')
const { location } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')

class Location extends Model {}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: location.tableName,
    schema: location.schema,
    underscored: false,
    timestamps: false,
    modelName: "location",
  }
)

module.exports = Location