const zmq = require('zmq')
const subscriber = zmq.socket('sub')
const moment = require('moment')
const sample = require('lodash/sample')
const random = require('lodash/random')
const dispatcher = require('./event-dispatcher')

const ports = [9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012]

const init = (app) => {

    subscriber.subscribe('event')

    ports.map(port => subscriber.connect('tcp://localhost:' + port))

    // subscriber.monitor(500, 0)

    subscriber.on('subscribe', (fd, ep) => console.log('-- connected to publisher'))

    subscriber.on('message', (channel, message) => {
        let m = JSON.parse(message.toString())

        m.id_mote = m.source
        m.fake_value = getTemperature()

        dispatcher.dispatchEvent(m)

        console.log(' [New Message]: ', channel.toString(), message.toString())
    })

}

const initSimulation = (app) => {

    const max_interval = 500
    let counter = 0

    setInterval(() => {
        const fake_event = {
            port: random(9002, 9005),
            source: random(10, 34), // should match ids from config file
            gateway_time: new Date().getTime() - random(400, 500),
            d8: [counter++, 0, 0, 0],
            d16: [random(400, 470), 0, 0, 0],
            target: 30
        }

        dispatcher.dispatchEvent(fake_event)
    }, random(500, max_interval))


}

module.exports.init = init
module.exports.initSimulation = initSimulation