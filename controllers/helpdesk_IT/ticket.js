const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const {
  Ticket,
  Sub_Category,
  Action,
  On_Behalf_Of,
} = require("../../models/helpdesk_IT/helpdesk_associations")
const Ticket_Status = require("../../models/helpdesk_IT/ticket_status")
const Category = require("../../models/helpdesk_IT/category")
const Grade = require("../../models/user/grade")
const { User } = require("../../models/user/user_associations")
const logger = require("../../util/logger")
const {
  tokenExtractor,
  whereDecider,
  reportCounter,
} = require("../../util/middleware")
const {
  WAITING_ID,
  ASSIGNED_ID,
  ATTENDED_ID,
  SW_SUPR_ID,
  HW_SUPR_ID,
} = require("../../util/config")

router.get("/search/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { og_number: req.params.id },
      raw: true,
    })
    console.log("User", user)
    const tickets = await Ticket.findAll({
      where: { complainer_user_id: user.id },
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
          attributes: { exclude: ["is_firstLogin", "is_active","user_name","user_password","createdAt",] },
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

router.get("/report", reportCounter, async (req, res, next) => {
  try {
    const where = {}
    if (req.query.type === "range") {
      where.createdAt = {
        [Op.and]: {
          [Op.gte]: req.query.dateStart,
          [Op.lte]: req.query.dateEnd,
        },
      }
    } else {
      where.createdAt = { [Op.gte]: req.query.dateStart }
    }
    const tickets = await Ticket.findAll({
      where: where,
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
          attributes: ["user_name", "employee_name", "og_number"],
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
      order: [["createdAt", "DESC"]],
    })
    res
      .status(200)
      .json({
        personCount: req.personCount,
        totalCount: req.totalCount,
        tickets,
      })
  } catch (error) {
    next(error)
  }
})

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
          attributes: { exclude: ["is_firstLogin", "is_active"] },
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

router.get("/", tokenExtractor, whereDecider, async (req, res, next) => {
  try {
    const currentPage = req.query.page ? req.query.page : 1
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
    res.status(200).json({ tickets: ticketAll.rows, meta })
  } catch (error) {
    next(error)
  }
})

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const ticket = req.body
    const user = await User.findOne({
      where: { og_number: ticket.employee_id },
    })
    ticket.complainer_user_id = user.id
    ticket.status_id = 1
    const result = await Ticket.create(ticket)
    const action = {
      user_id: req.decodedToken.id,
      ticket_id: result.id,
      action_detail: "New Complaint Inserted",
      comments: "Status: Waiting",
    }

    const actionRes = await Action.create(action)

    if (req.decodedToken.id !== user.id) {
      await On_Behalf_Of.create({
        ticket_id: result.id,
        created_by_user_id: req.decodedToken.id,
      })
    }
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", tokenExtractor, async (req, res, next) => {
  console.log("Reached Ticket Put")
  try {
    const body = req.body
    const ticket = await Ticket.findOne({
      where: {
        id: req.params.id,
      },
    })
    if (ticket) {
      if (
        body.assigned_to_user_id &&
        body.assigned_to_user_id !== ticket.assigned_to_user_id
      )
        ticket.assigned_to_user_id = body.assigned_to_user_id
      if (body.status_id) ticket.status_id = body.status_id

      const newTicket = await ticket.save()
      const statusName = await Ticket_Status.findOne({
        where: { id: body.status_id },
        raw: true,
      })
      const action = {
        user_id: req.decodedToken.id,
        ticket_id: ticket.id,
        action_detail: `Status: ${statusName.name}`,
        comments: body.comment ? body.comment : "",
      }

      await Action.create(action)
      res.status(200).json(newTicket)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
