let io
let env
const eventModel = require('./event-model')

const init = (app) => {
    const server = require('http').createServer(app)
    io = require('socket.io')(server)
    io.on('connection', (socket) => console.log(' -- user connected'))

    env = app.get('env')

    server.listen(3000)
}

const dispatchEvent = (event) => {
    // send to web client
    io.emit('message', event)

    // parse gateway_time
    event.gateway_time = new Date(event.gateway_time)

    if (env.toUpperCase() === 'develoment'.toUpperCase()) {

        // save to db
        // todo: use redis as this can be a performance 
        //       bottleneck in the future
        eventModel
            .addEvent(event)
            .catch(console.log)
    }

    // todo:
    // - alert when a certain threshold is reached
    // - call to external apis
}

module.exports.init = init
module.exports.dispatchEvent = dispatchEvent