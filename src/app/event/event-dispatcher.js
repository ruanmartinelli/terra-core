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
    // send to web client
    io.emit('message', event)

    // parse gateway_time
    event.gateway_time = new Date(event.gateway_time)


    if (env.toUpperCase() !== 'development'.toUpperCase()) {
        // refer to "complementary functions" in essays

        const functions = {
            'MDA100': () => 0, // TODO
            'TELOSB': telosbConvertTemperature
        }

        // // uncoment to test conversion
        // event.id = 1
        // event.d16 = [475, 0, 0, 0]
        // event.source = 11

        // event contains temperature data
        if (event.id && event.id == config.id_temperature_event) {

            // search for network model using the sensor identifier (souce)
            config.networks.forEach((network) => {

                if (network.mote_ids.includes(event.source)) {
                    // apply conversion function
                    event.celsius = functions[network.model](event.d16[0])
                    console.log('-- data converted to celsius: ', event.celsius)
                }
            })
        }

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