const { Model, DataTypes } = require("sequelize")
const {action, ticket, users } = require("../../util/tableNames")
const { sequelize } = require("../../util/db")

class Action extends Model {}

Action.init(
    {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: users, key: "id" },
        },
        ticket_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: ticket, key: "id" },
        },
        action_detail: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue:""
        },
        comments: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        createdAt: {
          type: DataTypes.DATE
      },
      },
  {
    sequelize,
    tableName: action.tableName,
    schema: action.schema,
    underscored: false,
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    modelName: "action",
  }
)

module.exports = Action
