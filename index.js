const app = require('./src')
const port = app.get('port')
const env = app.get('env')

app.listen(port, (err) => {
    if (err) throw err

    console.log(`${env} : listening on port ${port}`.toLowerCase())
})
