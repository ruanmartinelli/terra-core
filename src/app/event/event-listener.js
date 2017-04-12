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

        // if (!is_dev) {
        //     dispatcher.dispatchEvent({
        //         port: m.port,
        //         id_mote: m.source,
        //         gateway_time: m.gateway_time,
        //         value: getTemperature()
        //     })
        // }

        console.log(' [New Message]: ', channel.toString(), message.toString())
    })

}

const initSimulation = (app) => {
    startSimulationMode()
}

const getTemperature = () => {
    const rollDice = () => random(1, 6) == random(1, 6)

    return (rollDice() ? random(-15, -5) : random(-15, 1))
}

const startSimulationMode = () => {

    setTimeout(() => {
        const time = moment().format('hh:mm:ss')
        console.log(`[ ${time}h ] sending message`)

        dispatcher.dispatchEvent({
            gateway_time: new Date().getTime() - random(400, 500),
            port: sample(ports),
            id_mote: sample([11, 4, 9]),
            value: getTemperature()
        })
        startSimulationMode()
    }, random(500, 1500))
}

module.exports.init = init
module.exports.initSimulation = initSimulation