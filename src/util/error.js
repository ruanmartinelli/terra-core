const Promise = require('bluebird')

const baseError = (message, status) => Promise.reject({ message: message, status: status, success: false })

const notFound = (message) => baseError(message, 404)
const database = (message, err) => baseError(message, 500)
const validation = (message) => baseError(message, 422)

module.exports.database = database
module.exports.notFound = notFound
module.exports.validation = validation