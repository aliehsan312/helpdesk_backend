const { Model,DataTypes } = require('sequelize')
const { roles,user_roles,users } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')
class User_Role extends Model {}

User_Role.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: users, key: 'id' }
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: roles, key: 'id' }
      }
  },
  {
    sequelize,
    tableName: user_roles.tableName,
    schema: user_roles.schema,
    underscored: false,
    timestamps: false,
    modelName: "user_roles",
  }
)

module.exports = User_Role