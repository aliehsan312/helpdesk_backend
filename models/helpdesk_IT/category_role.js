const { Model, DataTypes } = require("sequelize")
const { category_role,category,roles } = require("../../util/tableNames")
const { sequelize } = require("../../util/db")

class Category_Role extends Model {}

Category_Role.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: roles, key: "id" },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: category, key: "id" },
      },
  },
  {
    sequelize,
    tableName: category_role.tableName,
    schema: category_role.schema,
    underscored: false,
    timestamps: false,
    modelName: "category_role",
  }
)

module.exports = Category_Role
