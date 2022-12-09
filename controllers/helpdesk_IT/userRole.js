const router = require("express").Router()
const { Op, Model } = require("sequelize")
//const logger = require('../../utils/logger')
const { User_Role } = require("../../models/helpdesk_IT/helpdesk_associations")
const Role = require("../../models/helpdesk_IT/role")
const User = require("../../models/user/user")
const {
  SW_TECH_ID,
  HW_TECH_ID,
  SW_SUPR_ID,
  HW_SUPR_ID,
} = require("../../util/config")
const { tokenExtractor } = require("../../util/middleware")

router.get("/:id", async (req, res, next) => {
  console.log("Reached ID")
  try {
    if (req.params.id && req.params.id !== "") {
      let roles = await User_Role.findAll({
        where: { user_id: req.params.id },
        include: [
          {
            model: Role,
            as: "role",
          },
        ],
      })
      if (!roles || roles.length === 0) {
        roles = await Role.findAll({ where: { name: "user" }, raw: true })
        res.status(200).json(roles)
      }
      else {
        const returnRoles = roles.map(item => item.role)
        res.status(200).json(returnRoles)
      }
      console.log("Role", roles)
      
    }
  } catch (error) {
    next(error)
  }
})
router.get("/", tokenExtractor, async (req, res, next) => {
  try {
    const where = {}
    const isSW_SUPER = await User_Role.findOne({
      where: { user_id: req.decodedToken.id, role_id: SW_SUPR_ID },
    })
    const isHW_SUPER = await User_Role.findOne({
      where: { user_id: req.decodedToken.id, role_id: HW_SUPR_ID },
    })
    if (isSW_SUPER && isHW_SUPER) {
      const techs = await User_Role.findAll({
        where: {
          [Op.or]: [
            {
              role_id: SW_TECH_ID,
            },
            {
              role_id: HW_TECH_ID,
            },
          ],
        },
        raw: true,
        nest: true,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "employee_name"],
          },
        ],
      })
      console.log("Tech", techs)
      res.status(200).json(techs)
    }
    if (req.decodedToken.role.name === "sw-supervisor")
      where.role_id = SW_TECH_ID
    else if (req.decodedToken.role.name === "hw-supervisor")
      where.role_id = HW_TECH_ID
    const techs = await User_Role.findAll({
      where,
      raw: true,
      nest: true,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "employee_name"],
        },
      ],
    })
    console.log("Tech", techs)
    res.status(200).json(techs)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body = req.body
    const user = await User_Role.findOne({
      where: { user_id: body.user_id, role_id: body.role_id },
    })
    if (user) {
      /* user.role_id = body.role_id
    await user.save() */
      res.status(200).json("User Role Updated.")
    } else {
      await User_Role.create(body)
      res.status(201).json("User Role Updated.")
    }
  } catch (error) {
    next(error)
  }
})

router.delete("/", async (req, res, next) => {
  try {
    const body = req.body
    const user = await User_Role.findOne({
      where: { user_id: body.user_id, role_id: body.role_id },
    })
    if (user) {
      await user.destroy()
      res.status(202).end()
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router
