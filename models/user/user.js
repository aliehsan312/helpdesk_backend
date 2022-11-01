const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../../util/db')
const { users,department,designation,grade,location } = require('../../util/tableNames')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
    type: DataTypes.NUMBER,
    allowNull: false,
    unique:true
  },
  employee_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    defaultValue:''
  },
  extension: {
    type: DataTypes.STRING,
    defaultValue:''
  },
  floor_number: {
    type: DataTypes.STRING,
    defaultValue:''
  },
  room_number: {
    type: DataTypes.STRING,
    defaultValue:''
  },
  tower: {
    type: DataTypes.TEXT(1),
    defaultValue:''
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
    type: DataTypes.STRING,
    defaultValue:''
  },
  comp_no: {
    type: DataTypes.STRING,
    defaultValue:''
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
