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

const getStats = (req, res, next) => {
    const getMessageCount = eventModel.getCount('id')
    const getMaxValue = eventModel.getMax('value')
    const getMinValue = eventModel.getMin('value')
    const getAverageValue = eventModel.getAverage('value')

    Promise.all([
        getMessageCount,
        getMaxValue,
        getMinValue,
        getAverageValue
    ])
        .then(([
            messageCount,
            maxValue,
            minValue,
            averageValue
        ]) => res.send({ averageValue, minValue, maxValue, messageCount }))
        .catch(next)
}

module.exports.getEvent = getEvent
module.exports.getEvents = getEvents
module.exports.getStats = getStats