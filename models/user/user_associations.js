const Department = require('./department')
const Designation = require('./desgination')
const Grade = require('./grade')
const Location = require('./location')
const User = require('./user')

User.hasOne(Location, {
    foreignKey: {
        name: 'location_id'
    }
})
User.hasOne(Grade, {
    foreignKey: {
        name: 'grade_id'
    }
})
User.hasOne(Department, {
    foreignKey: {
        name: 'department_id'
    }
})
User.hasOne(Designation, {
    foreignKey: {
        name: 'designation_id'
    }
})

//User.belongsToMany(Blog, { through: Reading, as: 'listed_blogs' })
//Blog.belongsToMany(User, { through: Reading, as: 'listed_by_users' })
module.exports = {
  User
}