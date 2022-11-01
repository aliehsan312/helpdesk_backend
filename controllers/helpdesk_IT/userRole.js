const router = require("express").Router()
const { Op } = require("sequelize")
//const logger = require('../../utils/logger')
const { User_Role }= require('../../models/helpdesk_IT/helpdesk_associations')
const Role = require('../../models/helpdesk_IT/role')
const User = require("../../models/user/user")
const { SW_TECH_ID, HW_TECH_ID } = require("../../util/helper")
const { tokenExtractor } = require("../../util/middleware")

router.get('/',tokenExtractor, async (req,res,next) => {
    const where = {}
    if(req.decodedToken.role.name === 'sw-supervisor') where.role_id = SW_TECH_ID
    else if(req.decodedToken.role.name === 'hw-supervisor') where.role_id = HW_TECH_ID
  try{
    const techs = await User_Role.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id","employee_name"]
        }
      ]
    })
    console.log( 'Tech',techs);
    res.status(200).json(techs)
  }
  catch(error) {next(error)}
})



router.put('/:id', async (req, res,next) => {
    try{
    const user = await User_Role.findOne({
        where: {
          user_id: req.params.id
        },
        include:[
          {
            model: Role,
            as: "role"
          }
        ]
      })
    if (user) {
    user.role_id = req.body.role
    const newUser = await user.save()
    console.log( 'Role',newUser.dataValues);
    res.status(200).json(newUser.dataValues.role)
  } else {
    const newUser = User_Role.create({user_id:req.params.id,role_id:req.body.role})
    res.status(200).json(newUser)
  }}
  catch(error) {next(error)}
})

module.exports = router
