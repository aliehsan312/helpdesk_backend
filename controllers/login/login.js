const router = require("express").Router()
const { User } = require("../../models/user/user_associations")
const { SECRET } = require("../../util/config")
const jwt = require("jsonwebtoken")
const { User_Role } = require("../../models/helpdesk_IT/helpdesk_associations")
const Role = require("../../models/helpdesk_IT/role")
const {
  USER_ACCESS_LEVEL,
  TECH_ACCESS_LEVEL,
  SUPR_ACCESS_LEVEL,
} = require("../../util/config")

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_name: req.body.username, user_password: req.body.password },
    })
    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
      })
    }
    const user_role = await User_Role.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
      raw: true,
      nest: true,
    })
    let highestRole = null

    if (user_role) {
      highestRole = user_role.find((item) => {
        if (
          item.role.name === "sw-supervisor" ||
          item.role.name === "hw-supervisor"
        )
          return item
      })
      if (!highestRole) {
        highestRole = user_role.find((item) => {
          if (
            item.role.name === "sw-technician" ||
            item.role.name === "hw-technician"
          )
            return item
        })
      }

      
    }
    
    const role = highestRole
      ? { id: highestRole.role.id, name: highestRole.role.name }
      : await Role.findOne({ where: { name: "user" }, raw: true })
    let level
    if (role.name === "user") level = USER_ACCESS_LEVEL
    else if (role.name === "sw-supervisor" || role.name === "hw-supervisor")
      level = SUPR_ACCESS_LEVEL
    else if (role.name === "sw-technician" || role.name === "hw-technician")
      level = TECH_ACCESS_LEVEL
    const userForToken = {
      id: user.id,
      name: user.employee_name,
      og_number: user.og_number,
      role: role,
      level: level,
    }
    const token = jwt.sign(userForToken, SECRET)
    res.status(200).send({
      token,
      id: userForToken.id,
      name: userForToken.name,
      og_number: userForToken.og_number,
      role: { id: userForToken.role.id, name: userForToken.role.name },
      level: userForToken.level,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
