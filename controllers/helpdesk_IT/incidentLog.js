const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const Incident_Log = require("../../models/helpdesk_IT/incident_log")

router.get("/", async (req, res, next) => {
  try {
    const logs = await Incident_Log.findAll({})
    res.status(200).json(logs)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body = req.body
    const newLog = await Incident_Log.create(body)
    res.status(201).json(newLog)
  } catch (error) {
    next(error)
  }
})

module.exports = router
