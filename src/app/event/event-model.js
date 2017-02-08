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

function getEvents({
    id,
    port,
    value,
    min_value,
    max_value,
    id_mote,
}) {

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

function addEvent(event) {
    let query = qb
        .insert(event)
        .into(table)

    return query
        .catch(err => error.database('Error adding event', err))
        .then(_.head)
        .then(getEvent)
}

module.exports.getEvent = getEvent
module.exports.getEvents = getEvents
module.exports.addEvent = addEvent