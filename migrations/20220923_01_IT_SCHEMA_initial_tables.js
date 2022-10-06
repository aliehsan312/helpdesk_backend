const { DataTypes } = require("sequelize")

const { category, ticket,ticket_status,sub_category,users} = require('../util/tableNames')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(category, {
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
      await queryInterface.createTable(ticket_status, {
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
      await queryInterface.createTable(sub_category, {
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: { model: category, key: 'id' }
        }
      }),
      await queryInterface.createTable(ticket, {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        subject: {
          type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: { model: category, key: 'id' }
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
            references: { model: sub_category, key: 'id' }
        },
        file_id: {
            type: DataTypes.INTEGER
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: { model: ticket_status, key: 'id'}
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        computer_num: {
            type: DataTypes.STRING
        },
        complainer_user_id: {
            type: DataTypes.UUID,
            allowNull:false,
            references: { model: users, key: 'id' }
        },
        assigned_to_user_id: {
            type: DataTypes.UUID,
            allowNull:false,
            references: { model: users, key: 'id' }
        }

      })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(ticket)
    await queryInterface.dropTable(sub_category)
    await queryInterface.dropTable(category)
    await queryInterface.dropTable(ticket_status)
    
  },
}
