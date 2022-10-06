const router = require("express").Router()
const Location = require("../../models/user/location")
const Department = require("../../models/user/department")
const Designation = require("../../models/user/desgination")
const Grade = require("../../models/user/grade")

router.get("/", async (req, res) => {
  const departments = await Department.findAll({})
  const locations = await Location.findAll({})
  const designations = await Designation.findAll({
    order: [["name", "ASC"]],
  })
  const grade = await Grade.findAll({})
  const data = {
    locations: locations,
    departments: departments,
    designations: designations,
    grades: grade,
  }
  console.log(data)
  res.json(data)
})

module.exports = router
