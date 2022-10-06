const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../../util/db')
const { users,ticket_status,category,sub_category, ticket } = require('../../util/tableNames')

class Ticket extends Model {}

Ticket.init({
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
}, {
  sequelize,
  tableName: ticket.tableName,
  schema: ticket.schema,
  underscored: false,
  timestamps: true,
  modelName: 'ticket'
})

module.exports = Ticket
