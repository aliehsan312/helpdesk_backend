const { Model,DataTypes } = require('sequelize')
const { department } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')

class Department extends Model {}

Department.init(
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
    tableName: department.tableName,
    schema: department.schema,
    underscored: false,
    timestamps: false,
    modelName: "department",
  }
)

module.exports = Department