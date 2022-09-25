const { Model,DataTypes } = require('sequelize')
const { grade } = require("../../util/tableNames")
const { sequelize } = require('../../util/db')

class Grade extends Model {}

Grade.init(
  {
    grade_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    grade_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: grade.tableName,
    schema: grade.schema,
    underscored: false,
    timestamps: false,
    modelName: "grade",
  }
)

module.exports = Grade