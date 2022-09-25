const router = require('express').Router()
const { Op, Sequelize } = require('sequelize')
const { Ticket,Sub_Category }= require('../../models/helpdesk_IT/helpdesk_associations')
const  Ticket_Status  = require('../../models/helpdesk_IT/ticket_status')
const  Category  = require('../../models/helpdesk_IT/category')
const  {User}  = require('../../models/user/user_associations')
const {ticket } = require('../../util/tableNames') 

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id)
  res.json(ticket)
})



router.get('/', async (req, res) => {

  const ticketAll = await Ticket.findAll({
    attributes: ['subject','complainer_user_id','assigned_to_user_id'],
    include:[ {
      model: Ticket_Status,
      attributes : ['ticket_status_name']
      },
    {
      model: Sub_Category,
      attributes : ['sub_category_name']
      },
    {
      model: Category,
      attributes : ['category_name']
      },
    {
      model: User,
      as:'complainer_user',
      attributes: ['user_name','first_name']
      },
    {
      model: User,
      as:'assigned_to_user',
      attributes: ['user_name','first_name']
      },
    ]
    })
  res.json(ticketAll)
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