const router = require("express").Router()
const { Op, Sequelize } = require("sequelize")
const Incident_Log = require("../../models/helpdesk_IT/incident_log")

router.get("/", async (req, res, next) => {
  let where = {}
  try {
    if (req.query.type === "text") {
      console.log( 'TEXT WHERE');
      where = {
        [Op.or]: [
          {
            system_id: { [Op.substring]: req.query.term },
          },{
            description: {[Op.substring]:req.query.term }
          }
        ],
      }
    }
    else if (req.query.type === "date") {
      console.log( 'DATE WHERE');
      where.createdAt = {
        [Op.and]: {
          [Op.gte]: req.query.startDate,
          [Op.lte]: req.query.endDate 
        }
      }
    }
    console.log(where);
    const logs = await Incident_Log.findAll({where:where,order: [["createdAt", "DESC"]],limit:30})
    //console.log(logs);
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
