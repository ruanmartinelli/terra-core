const _ = require('lodash')
const zmq = require('zmq')
const subscriber = zmq.socket('sub')
const ports = [9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012]

const bootstrap = (app) => {

    // socket io
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)

    io.on('connection', (socket) => console.log(' -- user connected'))

    setTimeout(() => io.emit('message', 'hello'), 5000)

    server.listen(3000)

    // zmq
    subscriber.subscribe('event')

    ports.map(port => subscriber.connect('tcp://localhost:' + port))

    subscriber.monitor(500, 0)

    subscriber.on('subscribe', (fd, ep) => {
        console.log('-- connected to publisher')
    })

    subscriber.on('message', (channel, message) => {
        let m = JSON.parse(message.toString())

        io.emit('message', {
            port: m.port,
            id_mote: m.source,
            gateway_time: m.gateway_time,
            value: getTemperature()
        })
        console.log(' -- new message:', channel.toString(), message.toString())
    })

    startTestMode(io)
}

const getTemperature = () => {
    const rollDice = () => _.random(1, 6) == _.random(1, 6)

    return (rollDice() ? _.random(24, 27) : _.random(28, 32))
}

const startTestMode = (socket) => {
    setTimeout(() => {
        socket.emit('message', {
            gateway_time: new Date().getTime() - _.random(400, 500),
            port: _.sample(ports),
            id_mote: _.sample([11, 4, 9]),
            value: getTemperature()
        })
        startTestMode(socket)
    }, _.random(500, 1500))
}

module.exports = bootstrap