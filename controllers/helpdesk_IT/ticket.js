const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const {
  Ticket,
  Sub_Category,
  Category_Role,
} = require("../../models/helpdesk_IT/helpdesk_associations")
const Ticket_Status = require("../../models/helpdesk_IT/ticket_status")
const Category = require("../../models/helpdesk_IT/category")
const Grade = require("../../models/user/grade")
const { User } = require("../../models/user/user_associations")
const logger = require("../../util/logger")
const { tokenExtractor } = require("../../util/middleware")

/* router.get("/:id",tokenExtractor, async (req, res, next) => {
  try {
    const ticket = await Ticket.findAll({where: {complainer_user_id:req.decodedToken.id}})
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}) */

router.get("/", tokenExtractor, async (req, res, next) => {
  console.log("Reacehd GET")

  try {
    const categories = await Category_Role.findAll({
      where: {
        role_id: 4,
      },
      attributes: { exclude: ["id"] },
    })
    console.log("Categorties", categories.map(item => item.dataValues.category_id))
    const ticketAll = await Ticket.findAll({
      where: {
        category_id: {
          [Op.or]: categories.map(item => item.dataValues.category_id),
        },
      },
      attributes: [
        "description",
        "complainer_user_id",
        "assigned_to_user_id",
        "id",
        'createdAt'
      ],
      include: [
        {
          model: Ticket_Status,
          attributes: { exclude: "description" },
        },
        {
          model: Sub_Category,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: User,
          as: "complainer_user",
          attributes: ["user_name", "employee_name"],
          include: [
            {
              model: Grade,
              attributes: ["name"],
            },
          ],
        },
        {
          model: User,
          as: "assigned_to_user",
          attributes: ["user_name", "employee_name"],
        },
      ],
      order: [['createdAt','DESC']]
    })
    console.log("Returned Tickets", ticketAll)
    res.status(200).json(ticketAll)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  logger.info("Reached POST")
  try {
    const ticket = req.body
    const user = await User.findOne({
      where: { og_number: ticket.employee_id },
    })
    ticket.complainer_user_id = user.id
    ticket.status_id = 1
    console.log("Ticket Here", ticket)
    const result = await Ticket.create(ticket)
    logger.info("From POST", result)
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
