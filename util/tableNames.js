//USER SCHEMA TABLES
const department = {schema:'user', tableName: 'department'}
const designation = {schema:'user', tableName: 'designation'}
const grade = {schema:'user', tableName: 'grade'}
const location = {schema:'user', tableName: 'location'}
const users = {schema:'user', tableName: 'users'}







//HELPDESK_IT SCHEMA TABLES

const category = { schema: "helpdesk_IT", tableName: "category" }
const ticket_status = { schema: "helpdesk_IT", tableName: "ticket_status" }
const sub_category = { schema: "helpdesk_IT", tableName: "sub_category" }
const ticket = { schema: "helpdesk_IT", tableName: "ticket" }
const action = { schema: "helpdesk_IT", tableName: "action"}
const on_behalf_of = { schema: "helpdesk_IT", tableName: "on_behalf_of"}

module.exports = {
    department,designation,grade,location,users,
    category,ticket,ticket_status,sub_category,action,on_behalf_of
}