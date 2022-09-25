const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../../util/db')
const { users,department,designation,grade,location } = require('../../util/tableNames')

class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  og_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
  },
  phone_number: {
    type: DataTypes.STRING
  },
  extension: {
    type: DataTypes.INTEGER
  },
  floor_number: {
    type: DataTypes.STRING
  },
  room_number: {
    type: DataTypes.STRING
  },
  tower: {
    type: DataTypes.TEXT(1)
  },
  designation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: designation, key: 'designation_id' }
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: department, key: 'department_id' }
  },
  email: {
    type: DataTypes.STRING
  },
  comp_no: {
    type: DataTypes.STRING
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: { model: location, key: 'location_id' }
  },
  grade_id: {
    type: DataTypes.INTEGER,
    references: { model: grade, key: 'grade_id' }
  },
  is_firstLogin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  tableName: users.tableName,
  schema: users.schema,
  underscored: false,
  timestamps: true,
  createdAt:true,
  updatedAt:false,
  modelName: 'user'
})

module.exports = User
