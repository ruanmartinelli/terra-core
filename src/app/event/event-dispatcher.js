let io
let env
const config = require('../../config')
const eventModel = require('./event-model')
const telosbConvertTemperature = require('../../module/sht1x-temperature')

const init = (app) => {
    const server = require('http').createServer(app)

    io = require('socket.io')(server)

    io.on('connection', (socket) => console.log(' -- user connected'))

    env = app.get('env')

    server.listen(3000)
}

const dispatchEvent = (event) => {

    // send to web client via socket.io
    io.emit('message', event)

    // parse gateway_time
    event.gateway_time = new Date(event.gateway_time)

    // save to database
    // eventModel.addEvent(event).catch(console.log)

    // // uncoment to test conversion
    event.id = 1
    event.d16 = [475, 0, 0, 0]
    event.source = 11

    // if (env.toUpperCase() !== 'DEVELOPMENT') 
    convert(event)
}

const convert = (event) => {

    const networks = config.networks

    const functions = {
        'MDA100': () => 0, // TODO
        'TELOSB': telosbConvertTemperature
    }

    const data_is_temperature = event.id && event.id == config.id_temperature_event

    if (data_is_temperature) {

        networks.forEach((network) => {
            // node id not registered in config
            if (!network.mote_ids.includes(event.source)) return

            event.celsius = functions[network.model](event.d16[0])
        })
    }
}

module.exports.init = init
module.exports.dispatchEvent = dispatchEvent