const listener = require('./event-listener')
const dispatcher = require('./event-dispatcher')
const eventController = require('./event-controller')
const chalk = require('chalk')

const init = (app) => {

    console.log(chalk.bold(` 🛰 Starting Event listeners`))

    dispatcher.init(app)

    if (app.get('env').toUpperCase() == 'DEVELOPMENT') listener.init(app)

    if (app.get('env').toUpperCase() != 'DEVELOPMENT') listener.initSimulation(app)

    console.log(chalk.bold(` 🛰 Creating Event routes`))

    app.get('/api/event', eventController.getEvents)
}

module.exports.init = init