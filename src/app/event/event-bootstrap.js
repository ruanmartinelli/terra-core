const zmq = require('zmq')
const subscriber = zmq.socket('sub')

const bootstrap = (app) => {

    // socket io
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)

    io.on('connection', (socket) => console.log(' -- user connected'))

    setTimeout(() => io.emit('message', 'hello'), 5000)

    server.listen(3000)

    // zmq
    subscriber.subscribe('event')
    subscriber.connect('tcp://localhost:5563')
    subscriber.monitor(500, 0)

    subscriber.on('subscribe', (fd, ep) => {
        console.log('-- connected to publisher')
    })

    subscriber.on('message', (channel, message) => {
        io.emit('message', JSON.parse(message.toString()))
        console.log(' -- new message:', channel.toString(), message.toString())
    })
}



module.exports = bootstrap