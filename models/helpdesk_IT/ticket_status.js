const { Model,DataTypes } = require('sequelize')
const { ticket_status } = require('../../util/tableNames')
const { sequelize } = require('../../util/db')

class Ticket_Status extends Model {}

Ticket_Status.init(
  {
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
  },
  {
    sequelize,
    tableName: ticket_status.tableName,
    schema: ticket_status.schema,
    underscored: false,
    timestamps: false,
    modelName: "ticket_status",
  }
)

module.exports = Ticket_Status