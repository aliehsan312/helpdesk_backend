const { DataTypes } = require("sequelize")

const { roles, user_roles, users } = require("../util/tableNames")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(roles, {
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
    }),
      await queryInterface.createTable(user_roles, {
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
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: roles, key: "id" },
        },
      })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(user_roles)
    await queryInterface.dropTable(roles)
  },
}
