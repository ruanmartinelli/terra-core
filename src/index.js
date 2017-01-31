const fs = require('fs')
const cors = require('cors')
const app = require('express')()
const config = require('./config')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const port = process.env.PORT || config.port

app.use(cors())
app.set('port', port)
app.set('env', 'dev')
app.use(bodyParser.json())
app.use(morgan('dev'))

require('./app').init(app)

app.use((err, req, res, next) => {
    if (err.status && err.message) res.status(err.status).send(err)

    if (!err.status || !err.message) {
        console.log(err)
        res.status(500).send(`Ops :( Something went bad (500)`)
    }
})

module.exports = app