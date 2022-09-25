const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")
const Session = require("../models/session")
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  try{
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    console.log("authorization", authorization)
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      console.log("from token extractor", req.decodedToken)
    } catch {
      throw ({name:"InvalidToken"})
    }
  } else {
    throw ({name:"MissingToken"})
  }}
  catch(error) { next(error)}
  next()
}

const isLoggedIn = async (req, res, next) => {
  try {
    const authorization = req.get("authorization").substring(7)
    const active = await Session.findOne({
      where: {
        token: authorization,
      },
    })
    if (active) req.loggedin = true
    else throw ({name:"SessionExpired"})
  } catch (error) {
    next(error)
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log("From Error Handler", error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "ContentMissing") {
    return response.status(404).send({ error: "Content Not Found" })
  } else if (error.name === "MissingToken") {
    return response.status(401).send({ error: "Token Missing" })
  } else if (error.name === "InvalidToken")
    res.status(401).json({ error: "token invalid" })
    else if (error.name === "SessionExpired") response.status(401).json({error: "Session Expired. Please Login."})
  else {
    return response.status(400).send({ error: error.message })
  }
}

module.exports = { tokenExtractor, isLoggedIn }
