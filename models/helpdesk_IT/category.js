const { Model, DataTypes } = require("sequelize")
const { category } = require("../../util/tableNames")
const { sequelize } = require("../../util/db")

class Category extends Model {}

Category.init(
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
    },
  },
  {
    sequelize,
    tableName: category.tableName,
    schema: category.schema,
    underscored: false,
    timestamps: false,
    modelName: "category",
  }
)

module.exports = Category
