const express = require("express")
const app = express()
const cors = require('cors')
const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")
const userRouter = require('./controllers/users/user')
const ticketRouter = require('./controllers/helpdesk_IT/ticket')
const categoriesRouter = require('./controllers/helpdesk_IT/categories')
const formInfoRouter = require('./controllers/users/formInfo')
const {requestLogger,errorHandler} = require('./util/middleware')
const logger = require('./util/logger')

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: "unknown endpoint" })
}


app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/tickets',ticketRouter)
app.use('/api/users',userRouter)
app.use('/api/categories',categoriesRouter)
app.use('/api/categories',categoriesRouter)
app.use('/api/forminfo',formInfoRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
