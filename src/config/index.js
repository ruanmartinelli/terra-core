// DO NOT PUT REAL KEYS AND REMOTE CREDENTIALS HERE

let config = {}

config.port = 9191

config.db_host = 'localhost'
config.db_user = 'root'
config.db_password = ''
config.db_database = 'terra-db'

config.networks = [
    { id: '01', model: 'TELOSB', mote_ids: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
    { id: '02', model: 'MDA100', mote_ids: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { id: '03', model: 'MDA100', mote_ids: [30, 31, 32, 33, 34] }
]

config.id_temperature_event = 1
config.id_luminosity_event = 2

module.exports = config