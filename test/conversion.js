const { isNumber } = require('lodash')
const test = require('ava')
const mda100_temperature = require('../src/helpers/mda100-temperature')
const sht1x_temperature = require('../src/helpers/sht1x-temperature')
const chalk = require('chalk')

test('convert mba100', t => {
  const sample_data = 497

  const celsius = mda100_temperature(sample_data)

  console.log(`${chalk.bgBlue('MBA100: ' + celsius)}`)

  t.is(isNumber(celsius), true)
})

test('convert sht1x (telosb)', t => {
  const sample_data = 6511

  const celsius = sht1x_temperature(sample_data)

  console.log(`${chalk.bgBlue('SHT1x: ' + celsius)}`)

  t.is(isNumber(celsius), true)
})
