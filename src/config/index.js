// DO NOT PUT REAL KEYS AND/OR REMOTE CREDENTIALS HERE
let config = {}

config.port = 9191
config.socket_io_port = 3000

config.db_host = 'localhost'
config.db_user = 'root'
config.db_password = ''
config.db_database = 'terra-db'

config.networks = [
    { id: '01', port: '10002', address: '192.168.1.0', model: 'TELOSB', mote_ids: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
    { id: '02', port: '10003', address: '192.168.1.0', model: 'MDA100', mote_ids: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { id: '03', port: '10004', address: '192.168.1.0', model: 'MDA100', mote_ids: [30, 31, 32, 33, 34] }
]

config.id_temperature_event = 1
config.id_luminosity_event = 2

config.simulation_interval = 2000

module.exports = config