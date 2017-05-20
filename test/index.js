const _ = require('lodash')
const app = require('../src')
const request = require('supertest')(app)
const test = require('ava')
const data = require('./_data')
const dispatcher = require('../src/app/event/event-dispatcher')

test('GET /api/network', async t => {
  const res = await request.get(`/api/network`)
  const networks = res.body

  t.is(res.status, 200)
  t.is(_.isArray(networks), true)
})

test('GET /api/event', async t => {
  const res = await request.get(`/api/event`)
  const events = res.body

  t.is(res.status, 200)
  t.is(_.isArray(events), true)
})

test('Dispatch events', async t => {
  const { raw_event } = data

  const event = dispatcher.dispatchEvent(raw_event)

  // TODO test if event is saved

  t.is(event.port, raw_event.port)
  t.is(event.id_mote, raw_event.source)
  t.is(_.isDate(event.gateway_time), true)
})
