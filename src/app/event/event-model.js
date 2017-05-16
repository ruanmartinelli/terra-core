const low = require('lowdb')
const db = low('db.json')

db.defaults({ events: [] }).write()

function addEvent(event) {
    db.get('events').push(event).write()
}

const getEvents = () => {
    return db.get('events')
}

module.exports = {
    addEvent,
    getEvents
}