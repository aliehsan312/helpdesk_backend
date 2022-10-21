const { DataTypes } = require("sequelize")

const { roles, category,category_role } = require("../util/tableNames")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(category_role, {
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
        allowNull: false,
        references: { model: category, key: "id" },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(category_role)
  },
}
