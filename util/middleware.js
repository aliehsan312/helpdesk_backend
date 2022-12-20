const jwt = require("jsonwebtoken")
const { SECRET, IN_PROCESS_ID, CLOSED_ID } = require("./config")
const logger = require("./logger")
const {
  SW_TECH_ID,
  HW_TECH_ID,
  SW_SUPR_ID,
  HW_SUPR_ID,
  WAITING_ID,
  ASSIGNED_ID,
  ATTENDED_ID,
  USER_ID,
} = require("./config")
const { Ticket } = require("../models/helpdesk_IT/helpdesk_associations")
const { Op, Sequelize } = require("sequelize")
const {
  Category_Role,
  User_Role,
} = require("../models/helpdesk_IT/helpdesk_associations")
const User = require("../models/user/user")
const moment = require("moment/moment")
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  next()
}

const tokenExtractor = (req, res, next) => {
  try {
    const authorization = req.get("authorization")
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      console.log("authorization", authorization)
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        console.log("from token extractor", req.decodedToken)
      } catch {
        throw { name: "InvalidToken" }
      }
    } else {
      throw { name: "MissingToken" }
    }
  } catch (error) {
    next(error)
  }
  next()
}

const reportCounter = async (req, res, next) => {
  try {
    const where = {}
    if (req.query.type === "range") {
      where.updatedAt = {
        [Op.and]: {
          [Op.gte]: req.query.dateStart,
          [Op.lte]: req.query.dateEnd,
        },
      }
    } else {
      where.updatedAt = { [Op.gte]: req.query.dateStart }
    }

    const tickets = await Ticket.findAll({
      where: where,
      attributes: [
        "assigned_to_user_id",
        Sequelize.fn("count", Sequelize.col("status_id")),
        "status_id",
      ],
      group: ["assigned_to_user_id", "status_id"],
      order: ["status_id"],
      raw: true,
    })
    const arrayUniqueByKey1 = [
      ...new Map(
        tickets.map((item) => [
          item["assigned_to_user_id"],
          item.assigned_to_user_id,
        ])
      ).values(),
    ]
    const finalArray = []

    const users = await User.findAll({
      where: { id: { [Op.or]: arrayUniqueByKey1 } },
      attributes: ["id", "employee_name"],
      raw: true,
    })

    for (const tech of users) {
      console.log("Here", tech)
      let sample = {
        id: tech.id,
        name: tech.employee_name,
        Waiting: "0",
        Assigned: "0",
        Attended: "0",
        In_Process: "0",
        Closed: "0",
      }
      
      const try1 = await Ticket.findAll({
        where: {...where,
          assigned_to_user_id: tech.id,
        },
        attributes: [
          Sequelize.fn("count", Sequelize.col("status_id")),
          "status_id",
        ],
        group: ["status_id"],
        order: ["status_id"],
        raw: true,
      })
      const ry2 = try1.map((item) => {
        switch (item.status_id) {
          case WAITING_ID:
            sample.Waiting = item.count
            break
          case ASSIGNED_ID:
            sample.Assigned = item.count
            break
          case ATTENDED_ID:
            sample.Attended = item.count
            break
          case IN_PROCESS_ID:
            sample.In_Process = item.count
            break
          case CLOSED_ID:
            sample.Closed = item.count
            break
          default:
            break
        }
      })
      finalArray.push(sample)
    }
    console.log("Tickets", tickets)
    const finalItem = tickets.find((item) => item.assigned_to_user_id === null)
    console.log("Final Item", finalItem)
    if (!!finalItem)
      finalArray.push({
        id: "",
        name: "",
        Waiting: finalItem.count,
        Assigned: "0",
        Attended: "0",
        In_Process: "0",
        Closed: "0",
      })

    const ticketNumbers = await Ticket.findAndCountAll({
      where,
      attributes: [
        "status_id",
        Sequelize.fn("count", Sequelize.col("status_id")),
      ],
      group: ["status_id"],
      raw: true,
    })
    const refactoredNumbers = ticketNumbers?.rows?.map(item => {
      switch(item.status_id){
        case WAITING_ID:
          label='Complaints Waiting'
          break
        case ASSIGNED_ID:
          label='Complaints Assigned'
          break
        case ATTENDED_ID:
          label='Complaints Attended'
          break
        case IN_PROCESS_ID:
          label='Complaints In-Process'
          break
        case CLOSED_ID:
          label='Complaints Resolved'
          break
        default:
          break
      }
      return {label,count:item.count}
    })
    refactoredNumbers.push({label:'Total Complaints',count: (await Ticket.count({where,raw:true})).toString()})
    req.personCount = finalArray
    req.totalCount = refactoredNumbers
    next()
  } catch (error) {
    next(error)
  }
}

const whereDecider = async (req, res, next) => {
  try {
    const previousWeek = moment().subtract(7,'days').startOf('day').toString()
    console.log( 'Week',previousWeek);
    const where = {}
    if (req.decodedToken.role.id === USER_ID) {
      where.complainer_user_id = req.decodedToken.id
    } else if (
      req.decodedToken.role.id === SW_TECH_ID ||
      req.decodedToken.role.id === HW_TECH_ID
    ) {
      where.assigned_to_user_id = req.decodedToken.id
      if (req.query.type) {
        switch (req.query.type) {
          case "new":
            where.status_id = {
              [Op.or]: [WAITING_ID, ASSIGNED_ID],
            }
            where.updatedAt = {
              [Op.gte]: previousWeek
            }
            break
          case "attended":
            where.status_id = ATTENDED_ID
            break
          default:
            break
        }
      }
    } else if (
      req.decodedToken.role.id === SW_SUPR_ID ||
      req.decodedToken.role.id === HW_SUPR_ID
    ) {
      const multipleRoleCheck =
        req.decodedToken.role.id === SW_SUPR_ID
          ? await User_Role.findOne({
              where: { user_id: req.decodedToken.id, role_id: HW_SUPR_ID },
            })
          : await User_Role.findOne({
              where: { user_id: req.decodedToken.id, role_id: SW_SUPR_ID },
            })
      const roleArray = multipleRoleCheck
        ? [req.decodedToken.role.id, multipleRoleCheck.role_id]
        : [req.decodedToken.role.id]
      if (req.query.type) {
        switch (req.query.type) {
          case "new":
            where.status_id = WAITING_ID
            where.updatedAt = {
              [Op.gte]: previousWeek
            }
            break
          case "attended":
            where.status_id = ATTENDED_ID
            break
          case "unattended":
            where.status_id = {
              [Op.or]: [ASSIGNED_ID, WAITING_ID],
            }
            break
          case "assigned_to_me":
            where.assigned_to_user_id = req.decodedToken.id
            break
          default:
            break
        }
      }
      const categories = await Category_Role.findAll({
        where: {
          role_id: { [Op.or]: roleArray },
        },
        attributes: { exclude: ["id"] },
      })
      console.log(
        "Categorties",
        categories.map((item) => item.dataValues.category_id)
      )
      if (!req.query.type || req.query.type !== "assigned_to_me") {
        where.category_id = {
          [Op.or]: categories.map((item) => item.dataValues.category_id),
        }
      }
    }

    req.where = where
  } catch (error) {
    next(error)
  }
  next()
}

const isLoggedIn = async (req, res, next) => {
  try {
    const authorization = req.get("authorization").substring(7)
    const active = await Session.findOne({
      where: {
        token: authorization,
      },
    })
    if (active) req.loggedin = true
    else throw { name: "SessionExpired" }
  } catch (error) {
    next(error)
  }
  next()
}

const userMatcher = (req, res, next) => {
  try {
    req.sameUser = req.decodedToken.id == req.body.employee_id ? true : false
    next()
  } catch (error) {
    next(error)
  }
}
const errorHandler = (error, request, response, next) => {
  console.log("From Error Handler", error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "ContentMissing") {
    return response.status(404).send({ error: "Content Not Found" })
  } else if (error.name === "MissingToken") {
    return response.status(401).send({ error: "Token Missing" })
  } else if (error.name === "InvalidToken")
    res.status(401).json({ error: "token invalid" })
  else if (error.name === "SessionExpired")
    response.status(401).json({ error: "Session Expired. Please Login." })
  else {
    return response.status(400).send({ error: error.message })
  }
}

module.exports = {
  tokenExtractor,
  isLoggedIn,
  requestLogger,
  errorHandler,
  whereDecider,
  userMatcher,
  reportCounter,
}
