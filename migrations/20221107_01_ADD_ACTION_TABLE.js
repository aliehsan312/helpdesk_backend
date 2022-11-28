const { DataTypes } = require("sequelize")

const { action, users, ticket} = require("../util/tableNames")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(action, {
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
        default:""
      },
      comments: {
        type: DataTypes.TEXT,
        default:""
      },
      createdAt: {
        type: DataTypes.DATE
    },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(action)
  },
}
