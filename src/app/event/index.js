const listener = require('./event-listener')
const dispatcher = require('./event-dispatcher')
const eventController = require('./event-controller')

const init = (app) => {

    dispatcher.init(app)

    if (app.get('env').toUpperCase() == 'DEVELOPMENT') listener.init(app)

    if (app.get('env').toUpperCase() != 'DEVELOPMENT') listener.initSimulation(app)

    app.get('/api/event', eventController.getEvents)

    app.get('/api/event/stats', eventController.getStats)

    app.get('/api/event/:id', eventController.getEvent)
}

module.exports.init = init