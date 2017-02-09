const _ = require('lodash')
const qb = require('../../database')
const error = require('../../util/error')
const table = 'event'
const columns = [
    'id',
    'port',
    'value',
    'id_mote',
    'gateway_time'
]

const getEvents = ({
    id,
    port,
    value,
    min_value,
    max_value,
    id_mote,
}) => {

    let query = qb
        .select(columns)
        .from(table)

    if (id) query.where('id', id)
    if (port) query.where('port', port)
    if (value) query.where('value', value)
    if (id_mote) query.where('id_mote', id_mote)
    if (min_value) query.where('value', '>=', min_value)
    if (max_value) query.where('value', '<=', max_value)

    return query
        .catch(err => error.database('Error finding events', err))
}

function getEvent(id) {
    return getEvents({ id })
        .then(_.head)
}

const addEvent = (event) => {
    let query = qb
        .insert(event)
        .into(table)

    return query
        .catch(err => error.database('Error adding event', err))
        .then(_.head)
        .then(getEvent)
}

const getCount = (field) => {
    let query = qb(table)
        .count(field + ' as count')

    return query
        .catch(err => error.database('Error finding event count', err))
        .then(_.head)
        .then(result => result['count'])
}

const getMax = (field) => {
    return qb(table)
        .max(field + ' as max')
        .catch(err => error.database('Error finding event max count', err))
        .then(_.head)
        .then(result => result['max'])
}

const getMin = (field) => {
    return qb(table)
        .min(field + ' as min')
        .catch(err => error.database('Error finding event min count', err))
        .then(_.head)
        .then(result => result['min'])
}

const getAverage = (field) => {
    return qb(table)
        .avg(field + ' as average')
        .catch(err => error.database('Error finding event average count', err))
        .then(_.head)
        .then(result => result['average'])

}

module.exports.getMax = getMax
module.exports.getMin = getMin
module.exports.getAverage = getAverage
module.exports.getEvent = getEvent
module.exports.getEvents = getEvents
module.exports.addEvent = addEvent
module.exports.getCount = getCount