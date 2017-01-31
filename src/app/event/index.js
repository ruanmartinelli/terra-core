const eventController = require('./event-controller')
const eventBootstrap = require('./event-bootstrap')

const init = (app) => {

    eventBootstrap(app)


}

module.exports.init = init