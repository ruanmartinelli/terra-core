const config = require('../config')

const db_config = {}

db_config.client = 'mysql'
db_config.debug = false
db_config.connection = {}
db_config.connection.host = config.db_host
db_config.connection.user = config.db_user
db_config.connection.password = config.db_password
db_config.connection.database = config.db_database

let knex = require('knex')(db_config)

module.exports = knex