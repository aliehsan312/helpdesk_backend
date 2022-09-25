const router = require('express').Router()
const { Op } = require('sequelize')
const{  User  }= require('../../models/user/user_associations')
const  Location  = require('../../models/user/location')
const  Department  = require('../../models/user/department')
const  Designation  = require('../../models/user/desgination')
const  Grade  = require('../../models/user/grade')


router.get('/:id', async (req, res) => {
  const users = await User.findByPk(req.params.id)
  res.json(users)
})



router.get('/', async (req, res) => {

  const users = await User.findAll({
    attributes: ['user_name'],
    include:[ {
      model: Location
      },
    {
      model: Department
      },
    {
      model: Designation
      },
    {
      model: Grade
      },
    ]
    })
  res.json(users)
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