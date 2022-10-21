const router = require("express").Router()
const { Op } = require("sequelize")
//const logger = require('../../utils/logger')
const { User_Role }= require('../../models/helpdesk_IT/helpdesk_associations')
const Role = require('../../models/helpdesk_IT/role')

router.put('/:username', async (req, res,next) => {
    try{
    const user = await User_Role.findOne({
        where: {
          user_id: req.params.username
        }
      })
    if (user) {
    user.role_id = req.body.role
    const newUser = await user.save()
    res.status(200).json(newUser)
  } else {
    const newUser = User_Role.create({user_id:req.params.id,role_id:req.body.role})
    res.status(200).json(newUser)
  }}
  catch(error) {next(error)}
})

module.exports = router
