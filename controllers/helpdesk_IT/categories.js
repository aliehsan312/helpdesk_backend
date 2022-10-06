const router = require('express').Router()
const { Op, Sequelize } = require('sequelize')
const Role = require('../../models/helpdesk_IT/role')
const {User_Role }= require('../../models/helpdesk_IT/helpdesk_associations')
const {Sub_Category }= require('../../models/helpdesk_IT/helpdesk_associations')
const Category = require('../../models/helpdesk_IT/category')
const User = require('../../models/user/user')
//const  Category  = require('../../models/helpdesk_IT/category')

router.get('/roles', async (req,res) => {
  const roles = await Role.findAll({})
  res.json(roles)
})

router.get('/', async ( req,res,next) => {
  try{
  const categories = await Category.findAll({
    attributes: {exclude:'description'},
    include: {
      model:Sub_Category,
      attributes: {exclude: 'description'}
    },
  })
  
  console.log( categories);
  res.json(categories)}
  catch(error) {next(error)}
})

router.post('/user_role', async (req,res,next) => {
  try{
  const body = req.body
  const user =await User_Role.findOne({where:{user_id:body.user_id}})
  if(user) {
    user.role_id = body.role_id
    await user.save()
    res.status(200).json('User Role Updated.')
  }
  else {
    await User_Role.create(body)
    res.status(201).json('User Role Updated.')
  }
}
catch(error) {next(error)}
})

/* router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
          username: req.params.username
        }
      })
    if (user) {
    user.username = req.body.username
    const newUser = await user.save()
    res.json(newUser)
  } else {
    res.status(404).end()
  }
}) */

module.exports = router