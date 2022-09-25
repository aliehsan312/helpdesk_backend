const { Model,DataTypes } = require('sequelize')
const { sub_category } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')
const {category} = require('../../util/tableNames')
class Sub_Category extends Model {}

Sub_Category.init(
  {
    sub_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sub_category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_id: {
          type: DataTypes.INTEGER,
          allowNull:false,
          references: { model: category, key: 'category_id' }
      }
  },
  {
    sequelize,
    tableName: sub_category.tableName,
    schema: sub_category.schema,
    underscored: false,
    timestamps: false,
    modelName: "sub_category",
  }
)

module.exports = Sub_Category