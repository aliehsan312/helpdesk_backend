const { DataTypes } = require("sequelize")

const { on_behalf_of, users, ticket} = require("../util/tableNames")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(on_behalf_of, {
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
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(on_behalf_of)
  },
}
