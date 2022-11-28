const { Model, DataTypes } = require("sequelize")
const { incident_log } = require("../../util/tableNames")
const { sequelize } = require("../../util/db")

class Incident_Log extends Model {}

Incident_Log.init(
    {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        system_id: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        location: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        type: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        informing_person: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        contact_person: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        description: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        solution: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        vendor_details: {
          type: DataTypes.TEXT,
          defaultValue:""
        },
        createdAt: {
          type: DataTypes.DATE
      },
      },
  {
    sequelize,
    tableName: incident_log.tableName,
    schema: incident_log.schema,
    underscored: false,
    timestamps: true,
    createdAt:true,
    updatedAt:false,
    modelName: "incident_log",
  }
)

module.exports = Incident_Log
