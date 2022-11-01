const router = require("express").Router()
const { Op } = require("sequelize")
//const logger = require('../../utils/logger')
const { User } = require("../../models/user/user_associations")
const Location = require("../../models/user/location")
const Department = require("../../models/user/department")
const Designation = require("../../models/user/desgination")
const Grade = require("../../models/user/grade")
const { User_Role }= require('../../models/helpdesk_IT/helpdesk_associations')
const Role = require('../../models/helpdesk_IT/role')
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { og_number: req.params.id },
      attributes: {exclude:['createdAt','user_name','user_password','is_active','is_firstLogin']},
      include: [
        {
          model:Location,
          as: "location"
        },
        {
          model: Department,
          as: "department"
        },
        {
          model:Designation,
          as: "designation"
        }
      ]
    })
    if (user) {
      const user_role = await User_Role.findOne({where: {
        user_id: user.id
      },
      include: [{
        model: Role,
        as:'role',
        attributes: ['id','name']
      },
      ],})
      const response = user_role ? {...user.dataValues,role:{
        id: user_role.role.id,
        name: user_role.role.name
      }} : {...user.dataValues,role:{
        id: 2,
        name: 'user'
      }}
      console.log( 'User Here',response);
      res.status(200).json(response)
    } 
    else res.status(400).json({ error: "No employee found with given ID." })
  } catch (error) {
    next(error)
  }
})

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: ["user_name", "employee_name"],
    include: [
      {
        model: Location,
      },
      {
        model: Department,
      },
      {
        model: Designation,
      },
      {
        model: Grade,
      },
    ],
  })
  res.json(users)
})
router.post("/", async (req, res,next) => {
  try{
  const body = req.body
  console.log("From POST", body)
  body.is_firstLogin = true
  const newUser = await User.create(body)
  res.status(200).json(newUser)
  }
  catch(error){next(error)}
})

router.put('/:id', async (req, res,next) => {
  try{
    const user = await User.findOne({
        where: {
          id: req.params.id
        }
      })
    if (user) {
    user.comp_no = req.body.comp_no,
    user.room_number = req.body.room_number,
    user.floor_number = req.body.floor_number,
    user.tower = req.body.tower,
    user.grade_id = req.body.grade_id,
    user.department_id = req.body.department_id,
    user.desgination_id = req.body.desgination_id,
    user.extension = req.body.extension,
    user.location_id = req.body.location_id,
    user.employee_name = req.body.employee_name,
    user.user_password = req.body.user_password,
    user.user_name = req.body.user_name,
    user.og_number = req.body.og_number,
    user.email = req.body.email
    const newUser = await user.save()
    res.status(200).json(newUser)
  } else {
    res.status(404).end()
  }
}catch(error) {next(error)}
})

module.exports = router
