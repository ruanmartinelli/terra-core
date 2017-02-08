const listener = require('./event-listener')
const dispatcher = require('./event-dispatcher')
const eventController = require('./event-controller')

const init = (app) => {

    dispatcher.init(app)

    listener.init(app)

    app.get('/api/event', eventController.getEvents)
    app.get('/api/event/:id', eventController.getEvent)
}

module.exports.init = init