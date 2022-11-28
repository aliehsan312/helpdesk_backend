const Sub_Category = require('./sub_category')
const Category = require('./category')
const Ticket = require('./ticket')
const Ticket_Status = require('./ticket_status')
const {User} = require('../user/user_associations')
const Role = require('./role')
const User_Role = require('./user_role')
const Category_Role = require('./category_role')
const On_Behalf_Of = require('./on_behalf_of')
const Action = require('./action')
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
Ticket.belongsTo(Ticket_Status, {
    foreignKey: {
        name: 'status_id'
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

Category_Role.belongsTo(Role, {
    as:'role',
    foreignKey:'role_id'
})
Category_Role.belongsTo(Category, {
    as:'category',
    foreignKey:'category_id'
})

On_Behalf_Of.belongsTo(User, {
    as:"created_by_user",
    foreignKey: 'created_by_user_id'
})

On_Behalf_Of.belongsTo(Ticket, {
    as:"ticket",
    foreignKey: 'ticket_id'
})

Action.belongsTo(Ticket, {
    as:'ticket',
    foreignKey:'ticket_id'
})

Action.belongsTo(User, {
    as:'user',
    foreignKey:'user_id'
})

//User.belongsToMany(Blog, { through: Reading, as: 'listed_blogs' })
//Blog.belongsToMany(User, { through: Reading, as: 'listed_by_users' })
module.exports = {
  Ticket,Sub_Category,Category,User_Role,Category_Role,On_Behalf_Of,Action
}