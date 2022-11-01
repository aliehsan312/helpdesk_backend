const { DataTypes } = require('sequelize')

const { department,designation,grade,location,users} = require('../util/tableNames')


module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(department, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    })
    await queryInterface.createTable(designation, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }),
    await queryInterface.createTable(grade, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable(location, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable(users, {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        default: DataTypes.UUIDV4,
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
        unique:true,
        allowNull: false
      },
      employee_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone_number: {
        type: DataTypes.STRING,
        default:''
      },
      extension: {
        type: DataTypes.STRING,
        default:''
      },
      floor_number: {
        type: DataTypes.STRING,
        default:''
      },
      room_number: {
        type: DataTypes.STRING,
        default:''
      },
      tower: {
        type: DataTypes.TEXT(1),
        default:''
      },
      designation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: designation, key: 'id' }
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: department, key: 'id' }
      },
      email: {
        type: DataTypes.STRING,
        default:''
      },
      comp_no: {
        type: DataTypes.STRING,
        default:''
      },
      location_id: {
        type: DataTypes.INTEGER,
        references: { model: location, key: 'id' }
      },
      grade_id: {
        type: DataTypes.INTEGER,
        references: { model: grade, key: 'id' }
      },
      is_firstLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN
      },
    })
    //await queryInterface.addColumn('blogs', 'user_id', {
   //   type: DataTypes.INTEGER,
   //   allowNull: false,
      //references: { model: 'users', key: 'id' },
   // })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable(users)
    await queryInterface.dropTable(department)
    await queryInterface.dropTable(designation)
    await queryInterface.dropTable(grade)
    await queryInterface.dropTable(location)
    
  },
}