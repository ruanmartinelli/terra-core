const eventModel = require('./event-model')

const getEvents = (req, res, next) => {
  const events = eventModel.getEvents()

  res.send(events)
}

module.exports = {
  getEvents
}
