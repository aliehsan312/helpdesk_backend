const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const Role = require("../../models/helpdesk_IT/role")
const { User_Role } = require("../../models/helpdesk_IT/helpdesk_associations")
const {
  Sub_Category,
} = require("../../models/helpdesk_IT/helpdesk_associations")
const Category = require("../../models/helpdesk_IT/category")
const User = require("../../models/user/user")
//const  Category  = require('../../models/helpdesk_IT/category')

router.get("/roles", async (req, res, next) => {
  try {
    const roles = await Role.findAll({})
    res.json(roles)
  } catch (error) {
    next(error)
  }
})

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: { exclude: "description" },
      include: {
        model: Sub_Category,
        attributes: { exclude: "description" },
      },
    })
    res.json(categories)
  } catch (error) {
    next(error)
  }
})

module.exports = router
