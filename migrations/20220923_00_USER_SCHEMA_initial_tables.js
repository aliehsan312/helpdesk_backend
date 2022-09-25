const { DataTypes } = require('sequelize')

const { department,designation,grade,location,users} = require('../util/tableNames')


module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(department, {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      department_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    })
    await queryInterface.createTable(designation, {
      designation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      designation_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }),
    await queryInterface.createTable(grade, {
      grade_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      grade_name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable(location, {
      location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      location_name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable(users, {
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