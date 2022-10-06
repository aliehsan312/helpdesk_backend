const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const {
  Ticket,
  Sub_Category,
} = require("../../models/helpdesk_IT/helpdesk_associations")
const Ticket_Status = require("../../models/helpdesk_IT/ticket_status")
const Category = require("../../models/helpdesk_IT/category")
const { User } = require("../../models/user/user_associations")
const logger = require("../../util/logger")

router.get("/:id", async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id)
    res.json(ticket)
  } catch (error) {
    next(error)
  }
})

router.get("/", async (req, res, next) => {
  try {
    const ticketAll = await Ticket.findAll({
      attributes: ["subject", "complainer_user_id", "assigned_to_user_id"],
      include: [
        {
          model: Ticket_Status,
          attributes: ["ticket_status_name"],
        },
        {
          model: Sub_Category,
          attributes: ["sub_category_name"],
        },
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: User,
          as: "complainer_user",
          attributes: ["user_name", "first_name"],
        },
        {
          model: User,
          as: "assigned_to_user",
          attributes: ["user_name", "first_name"],
        },
      ],
    })
    res.json(ticketAll)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  logger.info("Reached POST")
  try {
    const ticket = req.body
    ticket.complainer_user_id = req.body.user_id
    ticket.assigned_to_user_id = req.body.user_id
    const result = await Ticket.create(ticket)
    logger.info('From POST',result)
    res.json(result)
  } catch (error) {
    next(error)
  }
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
