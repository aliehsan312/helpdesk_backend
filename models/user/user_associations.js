const Department = require('./department')
const Designation = require('./desgination')
const Grade = require('./grade')
const Location = require('./location')
const User = require('./user')

User.belongsTo(Location, {
    foreignKey: {
        name: 'location_id'
    }
})
User.belongsTo(Grade, {
    foreignKey: {
        name: 'grade_id'
    }
})
User.belongsTo(Department, {
    foreignKey: {
        name: 'department_id'
    }
})
User.belongsTo(Designation, {
    foreignKey: {
        name: 'designation_id'
    }
})

//User.belongsToMany(Blog, { through: Reading, as: 'listed_blogs' })
//Blog.belongsToMany(User, { through: Reading, as: 'listed_by_users' })
module.exports = {
  User
}