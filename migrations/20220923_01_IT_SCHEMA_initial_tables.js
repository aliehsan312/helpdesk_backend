const { DataTypes } = require("sequelize")

const { category, ticket,ticket_status,sub_category,users} = require('../util/tableNames')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(category, {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }),
      await queryInterface.createTable(ticket_status, {
        ticket_status_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ticket_status_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      }),
      await queryInterface.createTable(sub_category, {
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
      }),
      await queryInterface.createTable(ticket, {
        ticket_id: {
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
            references: { model: category, key: 'category_id' }
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
            references: { model: sub_category, key: 'sub_category_id' }
        },
        file_id: {
            type: DataTypes.INTEGER
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: { model: ticket_status, key: 'ticket_status_id'}
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
            type: DataTypes.INTEGER,
            allowNull:false,
            references: { model: users, key: 'user_id' }
        },
        assigned_to_user_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: { model: users, key: 'user_id' }
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
