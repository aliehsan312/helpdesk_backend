const { Model,DataTypes } = require('sequelize')
const { sequelize } = require('../../util/db')
const { roles } = require('../../util/tableNames')
class Role extends Model {}

Role.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      }
  },
  {
    sequelize,
    tableName: roles.tableName,
    schema: roles.schema,
    underscored: false,
    timestamps: false,
    modelName: "roles",
  }
)

module.exports = Role