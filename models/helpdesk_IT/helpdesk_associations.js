const Sub_Category = require('./sub_category')
const Category = require('./category')
const Ticket = require('./ticket')
const Ticket_Status = require('./ticket_status')
const {User} = require('../user/user_associations')
const Role = require('./role')
const User_Role = require('./user_role')

Ticket.belongsTo(User, {
    as: 'complainer_user',
    foreignKey: {
        name: 'complainer_user_id'
    }
})
Ticket.belongsTo(User, {
    as: 'assigned_to_user',
    foreignKey: {
        name: 'assigned_to_user_id',
    }
})
Ticket.belongsTo(Category, {
    foreignKey: {
        name: 'category_id'
    }
})
Ticket.hasOne(Ticket_Status, {
    foreignKey: {
        name: 'ticket_status_id'
    }
})
Ticket.belongsTo(Sub_Category, {
    foreignKey: {
        name: 'subcategory_id'
    }
})
Sub_Category.belongsTo(Category, {
    foreignKey: {
        name: 'category_id'
    }
})
Category.hasMany(Sub_Category, {
    foreignKey : 'category_id'
})

User_Role.belongsTo(Role, {
    as: 'role',
    foreignKey: 'role_id'
})

User_Role.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
})

//User.belongsToMany(Blog, { through: Reading, as: 'listed_blogs' })
//Blog.belongsToMany(User, { through: Reading, as: 'listed_by_users' })
module.exports = {
  Ticket,Sub_Category,Category,User_Role
}