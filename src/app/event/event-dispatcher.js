let io
const eventModel = require('./event-model')

const init = (app) => {
    const server = require('http').createServer(app)
    io = require('socket.io')(server)
    io.on('connection', (socket) => console.log(' -- user connected'))

    server.listen(3000)
}

const dispatchEvent = (event) => {
    // parse gateway_time
    event.gateway_time = new Date(event.gateway_time)

    // send to web client
    io.emit('message', event)

    // save to db
    // todo: use redis as this can be a performance 
    //       bottleneck in the future
    eventModel
        .addEvent(event)
        .catch(console.log)

    // todo:
    // - alerts when a certain threshold is reached
    // - calls to external apis
}

module.exports.init = init
module.exports.dispatchEvent = dispatchEvent