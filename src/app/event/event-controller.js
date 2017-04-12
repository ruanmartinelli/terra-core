const _ = require('lodash')
const eventModel = require('./event-model')
let fakeMessageCount = 1500

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
    // non development envs will send a mock response
    // because there is not a database to fetch data yet 
    if (req.app.get('env').toUpperCase() !== 'development'.toUpperCase()) {
        fakeMessageCount += + _.random(5, 30)

        return res.send({
            averageValue: _.random(-10, -5),
            minValue: -12,
            maxValue: -2,
            messageCount: fakeMessageCount
        })
    }

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