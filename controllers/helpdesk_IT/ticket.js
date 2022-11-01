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
const { tokenExtractor,whereDecider } = require("../../util/middleware")


router.get("/:id", async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      where: { complainer_user_id: req.params.id },
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
          attributes: ["user_name", "employee_name","og_number"],
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
      order: [["updatedAt", "DESC"]],
        
  })
    res.status(200).json(tickets)
  } catch (error) {
    next(error)
  }
})

router.get("/", tokenExtractor,whereDecider, async (req, res, next) => {
  console.log("Reacehd GET")

  try {
    
    const currentPage = req.params.page ? req.query.page : 1
    const offset = (currentPage - 1) * 10

    const ticketAll = await Ticket.findAndCountAll({
      where: req.where,
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
      order: [["updatedAt", "DESC"]],
      offset: offset,
      limit: 10,
    })

    const totalItems = ticketAll.count
    const totalPages = Math.ceil(ticketAll.count / 10)
    const hasNextPage = currentPage < totalPages ? true : false
    const hasPreviousPage = currentPage > 1 ? true : false
    const meta = {
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: currentPage,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
    }
    console.log("Returned Tickets", totalPages)
    res.status(200).json({ tickets: ticketAll.rows, meta })
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
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const body = req.body
    const ticket = await Ticket.findOne({
      where: {
        id: req.params.id,
      },
    })
    if (ticket) {
      if (body.assigned_to_user_id)
        ticket.assigned_to_user_id = body.assigned_to_user_id
      if (body.status_id) ticket.status_id = body.status_id
      const newTicket = await ticket.save()
      res.status(200).json(newTicket)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
