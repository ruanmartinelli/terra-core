const app = require('./src')
const port = app.get('port')
const env = app.get('env')
const chalk = require('chalk')

app.listen(port, err => {
  if (err) throw err

  console.log(`${chalk.bold(' 🛰 App listening on port ' + port)}`)
})
