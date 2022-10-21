const router = require("express").Router()
const { User } = require("../../models/user/user_associations")
const { SECRET } = require("../../util/config")
const jwt = require("jsonwebtoken")
const { User_Role } = require("../../models/helpdesk_IT/helpdesk_associations")
const Role = require("../../models/helpdesk_IT/role")

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
    const user_role = await User_Role.findOne({
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
    })
    const userForToken = {
      username: user.username,
      id: user.id,
      name: user.employee_name,
      og_number: user.og_number,
      role: user_role
        ? {
            id: user_role.role.id,
            name: user_role.role.name,
          }
        : {
            id: 2,
            name: "user",
          },
    }
    const token = jwt.sign(userForToken, SECRET)
    res
      .status(200)
      .send({
        token,
        id: userForToken.id,
        name: userForToken.name,
        og_number: userForToken.og_number,
        role: { id: userForToken.role.id, name: userForToken.role.name },
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
