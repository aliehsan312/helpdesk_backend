const express = require("express")
const app = express()

const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")
const userRouter = require('./controllers/users/user')
const ticketRouter = require('./controllers/helpdesk_IT/ticket')
app.use(express.json())
const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: "unknown endpoint" })
}
app.use('/api/tickets',ticketRouter)
app.use('/api/users',userRouter)
app.use(unknownEndpoint)
//app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
