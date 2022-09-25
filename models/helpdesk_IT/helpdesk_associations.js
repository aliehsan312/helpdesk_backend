const Sub_Category = require('./sub_category')
const Category = require('./category')
const Ticket = require('./ticket')
const Ticket_Status = require('./ticket_status')
const {User} = require('../user/user_associations')

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
Ticket.hasOne(Category, {
    foreignKey: {
        name: 'category_id'
    }
})
Ticket.hasOne(Ticket_Status, {
    foreignKey: {
        name: 'ticket_status_id'
    }
})
Ticket.hasOne(Sub_Category, {
    foreignKey: {
        name: 'sub_category_id'
    }
})
Sub_Category.hasOne(Category, {
    foreignKey: {
        name: 'category_id'
    }
})

//User.belongsToMany(Blog, { through: Reading, as: 'listed_blogs' })
//Blog.belongsToMany(User, { through: Reading, as: 'listed_by_users' })
module.exports = {
  Ticket,Sub_Category
}