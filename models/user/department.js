const { Model,DataTypes } = require('sequelize')
const { department } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')

class Department extends Model {}

Department.init(
  {
    department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      department_name: {
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