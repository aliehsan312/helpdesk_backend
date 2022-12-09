const jwt = require("jsonwebtoken")
const { SECRET } = require("./config")
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
const { Op, Sequelize } = require("sequelize")
const {
  Category_Role,
  User_Role,
} = require("../models/helpdesk_IT/helpdesk_associations")
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

const whereDecider = async (req, res, next) => {
  try {
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
      const roleArray = multipleRoleCheck ? [req.decodedToken.role.id,multipleRoleCheck.role_id] : [req.decodedToken.role.id]
      if (req.query.type) {
        switch (req.query.type) {
          case "new":
            where.status_id = WAITING_ID
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
          role_id: { [Op.or] : roleArray},
        },
        attributes: { exclude: ["id"] },
      })
      console.log(
        "Categorties",
        categories.map((item) => item.dataValues.category_id)
      )
      if(!req.query.type || req.query.type !== "assigned_to_me") {
      where.category_id = {
        [Op.or]: categories.map((item) => item.dataValues.category_id),
      }}
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
}
