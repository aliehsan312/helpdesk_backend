const router = require("express").Router()
const { User } = require("../../models/user/user_associations")
const { SECRET } = require("../../util/config")
const jwt = require("jsonwebtoken")
const { User_Role } = require("../../models/helpdesk_IT/helpdesk_associations")
const Role = require("../../models/helpdesk_IT/role")
const  { USER_ID, USER_ACCESS_LEVEL,SW_TECH_ID,HW_TECH_ID,TECH_ACCESS_LEVEL, SUPR_ACCESS_LEVEL,HW_SUPR_ID,SW_SUPR_ID }  = require("../../util/helper")

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
    const role = user_role
        ? {
            id: user_role.role.id,
            name: user_role.role.name,
          }
        : {
            id: 2,
            name: "user",
          }
    let level;
    if(role.id === USER_ID) level = USER_ACCESS_LEVEL
    else if (role.id === SW_TECH_ID || role.id === HW_TECH_ID) level = TECH_ACCESS_LEVEL
    else if (role.id === HW_SUPR_ID || role.id === SW_SUPR_ID) level = SUPR_ACCESS_LEVEL
    const userForToken = {
      id: user.id,
      name: user.employee_name,
      og_number: user.og_number,
      role: role,
      level: level
    }
    console.log( 'User for Token', userForToken);
    const token = jwt.sign(userForToken, SECRET)
    res
      .status(200)
      .send({
        token,
        id: userForToken.id,
        name: userForToken.name,
        og_number: userForToken.og_number,
        role: { id: userForToken.role.id, name: userForToken.role.name },
        level: userForToken.level
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
