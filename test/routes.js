/* eslint-env mocha */
const config = require('../src/config')
const dal = require('../src/dal')
const db = require('../src/db')
const express = require('express')
const routes = require('../src/routes')
const request = require('supertest')
const sinon = require('sinon')

describe('Route', function () {
  const app = express()
  app.use(routes)

  describe('_health', function () {
    const endpoint = '/_health'
    it('returns 200', function () {
      return request(app).get(endpoint).expect(200)
    })
  })

  describe('_db_health', function () {
    const endpoint = '/_db_health'
    beforeEach(function () {
      sinon.stub(dal, '_health')
    })

    afterEach(function () {
      dal._health.restore()
    })

    it('returns 200 if the database can be queried', function () {
      dal._health.resolves()
      return request(app).get(endpoint).expect(200)
    })

    it('returns 502 if the database cannot be queried', function () {
      dal._health.rejects(new Error('ConnectionError'))
      return request(app).get(endpoint).expect(502)
    })
  })

  describe('rsvp', function () {
    let rsvp
    let dbResult
    beforeEach(function () {
      config.INVITE_CODE = 'password'
      rsvp = {
        additionalNotes: 'Yay! Wedding!',
        inviteCode: 'password',
        numberOfAttendees: 1,
        attendees: [{
          name: 'Foo McBarson',
          isAttending: true
        }]
      }

      sinon.stub(db, 'query')
      dbResult = { id: 1 }
      db.query.resolves({
        command: 'INSERT',
        fields: Object.keys(dbResult),
        rowCount: 1,
        rows: [dbResult]
      })
    })

    afterEach(function () {
      db.query.restore()
    })

    it('returns 201 if everything checks out', function () {
      return request(app).post('/rsvp').send(rsvp)
      .expect(201)
      .expect(dbResult)
    })

    it('returns 201 even if additionalNotes is blank', function () {
      rsvp.additionalNotes = ''
      return request(app).post('/rsvp').send(rsvp)
      .expect(201)
      .expect(dbResult)
    })

    it('returns 400 if numberOfAttendees does not match the number of attendees', function () {
      rsvp.numberOfAttendees = 2
      return request(app).post('/rsvp').send(rsvp)
      .expect(400)
      .expect({ message: 'numberOfAttendees mismatch' })
    })

    it('returns 400 if any attendee is missing a name', function () {
      rsvp.attendees[0].name = ''
      return request(app).post('/rsvp').send(rsvp)
      .expect(400)
      .expect({ message: 'name cannot be blank' })
    })

    it('returns 400 if any attendee name is not a string', function () {
      rsvp.attendees[0].name = 1
      return request(app).post('/rsvp').send(rsvp)
      .expect(400)
      .expect({ message: 'name must be a string' })
    })

    it('returns 400 if any attendee is missing isAttending', function () {
      delete rsvp.attendees[0].isAttending
      return request(app).post('/rsvp').send(rsvp)
      .expect(400)
      .expect({ message: 'isAttending must be a boolean' })
    })

    it('returns 400 if any isAttending not a boolean', function () {
      rsvp.attendees[0].isAttending = 'true'
      return request(app).post('/rsvp').send(rsvp)
      .expect(400)
      .expect({ message: 'isAttending must be a boolean' })
    })

    it('returns 401 if the invite code doesn\'t match', function () {
      rsvp.inviteCode = 'notthepassword'
      return request(app).post('/rsvp').send(rsvp)
      .expect(401)
      .expect({ message: 'Sorry, I don\'t recognize this code. Please double-check that it matches the one on your paper invitation (case matters).' })
    })
  })
})
