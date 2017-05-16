const random = require('lodash/random')

const raw_event = {
    port: random(9002, 9005),
    source: random(10, 34), // should match ids from config file
    gateway_time: new Date().getTime() - random(400, 500),
    d8: [22, 0, 0, 0],
    d16: [random(400, 470), 0, 0, 0],
    target: 30
}

module.exports = {
    raw_event
}