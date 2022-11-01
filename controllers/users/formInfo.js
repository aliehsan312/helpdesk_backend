const router = require("express").Router()
const Location = require("../../models/user/location")
const Department = require("../../models/user/department")
const Designation = require("../../models/user/desgination")
const Grade = require("../../models/user/grade")
const Role = require('../../models/helpdesk_IT/role')
const Ticket_Status = require('../../models/helpdesk_IT/ticket_status')
router.get("/", async (req, res) => {
  const departments = await Department.findAll({})
  const locations = await Location.findAll({})
  const designations = await Designation.findAll({
    order: [["name", "ASC"]],
  })
  const grade = await Grade.findAll({})
  const role = await Role.findAll({})
  const ticket_status = await Ticket_Status.findAll({})
  const data = {
    locations: locations,
    departments: departments,
    designations: designations,
    grades: grade,
    roles:role,
    statusList:ticket_status
  }
  console.log( 'DataGor',data);
  res.status(200).json(data)
})

module.exports = router
