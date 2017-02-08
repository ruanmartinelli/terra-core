const eventModel = require('./event-model')

const getEvent = (req, res, next) => {
    const id = req.params.id

    eventModel
        .getEvent(id)
        .then(result => res.send(result))
        .catch(next)
}

const getEvents = (req, res, next) => {
    let filter = req.query

    eventModel
        .getEvents(filter)
        .then(result => res.send(result))
        .catch(next)
}

module.exports.getEvent = getEvent
module.exports.getEvents = getEvents