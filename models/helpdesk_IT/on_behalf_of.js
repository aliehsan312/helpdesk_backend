const { Model, DataTypes } = require("sequelize")
const { on_behalf_of, ticket, users } = require("../../util/tableNames")
const { sequelize } = require("../../util/db")

class On_Behalf_Of extends Model {}

On_Behalf_Of.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ticket, key: "id" },
    },
    created_by_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: users, key: "id" },
    },
  },
  {
    sequelize,
    tableName: on_behalf_of.tableName,
    schema: on_behalf_of.schema,
    underscored: false,
    timestamps: false,
    modelName: "on_behalf_of",
  }
)

module.exports = On_Behalf_Of
