const bootstrap = (app) => {

    const server = require('http').createServer(app)
    const io = require('socket.io')(server)

    io.on('connection', (socket) => console.log(' -- user connected'))

    setTimeout(() => io.emit('message', 'hello'), 5000)

    server.listen(3000)
}

module.exports = bootstrap