const { DataTypes } = require("sequelize")

const { incident_log} = require("../util/tableNames")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(incident_log, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      system_id: {
        type: DataTypes.TEXT,
        default:""
      },
      location: {
        type: DataTypes.TEXT,
        default:""
      },
      type: {
        type: DataTypes.TEXT,
        default:""
      },
      informing_person: {
        type: DataTypes.TEXT,
        default:""
      },
      contact_person: {
        type: DataTypes.TEXT,
        default:""
      },
      description: {
        type: DataTypes.TEXT,
        default:""
      },
      solution: {
        type: DataTypes.TEXT,
        default:""
      },
      vendor_details: {
        type: DataTypes.TEXT,
        default:""
      },
      createdAt: {
        type: DataTypes.DATE
    },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(incident_log)
  },
}
