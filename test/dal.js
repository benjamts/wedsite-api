/* eslint-env mocha */
const assert = require('assert')
const dal = require('../src/dal')
const db = require('../src/db')
const sinon = require('sinon')
const sql = require('../src/sql-template-tag')
const { ValidationError } = require('../src/validators')

describe('dal', function () {
  before(function () {
    sinon.stub(db, 'query').resolves()
  })

  afterEach(function () {
    db.query.reset()
  })

  after(function () {
    db.query.restore()
  })

  describe('insertAttendee', function () {
    let attendee
    let newAttendee
    beforeEach(function () {
      attendee = {
        rsvpId: 1,
        name: 'Foo McBarson',
        isAttending: true
      }

      newAttendee = { id: 100 }
      db.query.resolves({
        command: 'INSERT',
        fields: Object.keys(newAttendee),
        rowCount: 1,
        rows: [newAttendee]
      })
    })

    function assertInsertFails (attendee) {
      return dal.insertAttendee(attendee)
      .then(() => assert.ok(false))
      .catch(function (err) {
        if (err instanceof ValidationError) {
          assert(db.query.notCalled)
        } else {
          throw err
        }
      })
    }

    describe('runs an insert query', function () {
      it('with the given attendee\'s attributes', function () {
        return dal.insertAttendee(attendee)
        .then(function () {
          const [querystring, values] = db.query.args[0]
          assert(db.query.calledOnce)
          assert.equal(querystring, sql`
            INSERT INTO attendee
            (rsvp_id, name, is_attending)
            VALUES
            ($1, $2, $3);
          `)
          assert.deepEqual(values, [
            attendee.rsvpId,
            attendee.name,
            attendee.isAttending
          ])
        })
      })

      it('resolving to the newly created attendee info', function () {
        return dal.insertAttendee(attendee)
        .then(res => assert.equal(res, newAttendee))
      })
    })

    describe('rsvpId', function () {
      it('can be an integer', function () {
        return dal.insertAttendee(attendee)
        .then(() => assert(db.query.calledOnce))
      })

      it('cannot be a non-integer', function () {
        attendee.rsvpId = '1'
        return assertInsertFails(attendee)
      })
    })

    describe('name', function () {
      it('can be a string', function () {
        return dal.insertAttendee(attendee)
        .then(() => assert(db.query.calledOnce))
      })

      it('cannot be a non-string', function () {
        delete attendee.name
        return assertInsertFails(attendee)
      })

      it('cannot be blank', function () {
        attendee.name = '  '
        return assertInsertFails(attendee)
      })
    })

    describe('isAttending', function () {
      it('can be true', function () {
        attendee.isAttending = true
        return dal.insertAttendee(attendee)
        .then(() => assert(db.query.calledOnce))
      })

      it('can be false ...I guess :(', function () {
        attendee.isAttending = false
        return dal.insertAttendee(attendee)
        .then(() => assert(db.query.calledOnce))
      })

      it('cannot be a non-Boolean', function () {
        attendee.isAttending = 'true'
        return assertInsertFails(attendee)
      })
    })
  })

  describe('insertRSVP', function () {
    let rsvp
    let newRsvp
    beforeEach(function () {
      rsvp = { additionalNotes: 'foobar' }

      newRsvp = { id: 100, additionalNotes: 'foobar' }
      db.query.resolves({
        command: 'INSERT',
        fields: Object.keys(newRsvp),
        rowCount: 1,
        rows: [newRsvp]
      })
    })

    function assertInsertFails (rsvp) {
      return dal.insertRSVP(rsvp)
      .then(() => assert.ok(false))
      .catch(function (err) {
        if (err instanceof ValidationError) {
          assert(db.query.notCalled)
        } else {
          throw err
        }
      })
    }

    describe('runs an insert query', function () {
      it('with the given rsvp\'s attributes', function () {
        return dal.insertRSVP(rsvp)
        .then(function () {
          const [querystring, values] = db.query.args[0]
          assert(db.query.calledOnce)
          assert.equal(querystring, sql`
            INSERT INTO rsvp
            (additional_notes)
            VALUES
            ($1);
          `)
          assert.deepEqual(values, [rsvp.additionalNotes])
        })
      })

      it('resolving to the newly created rsvp info', function () {
        return dal.insertRSVP(rsvp)
        .then(res => assert.equal(res, newRsvp))
      })
    })

    describe('additionalNotes', function () {
      it('can be a string', function () {
        rsvp.additionalNotes = 'foo'
        return dal.insertRSVP(rsvp)
        .then(() => assert(db.query.calledOnce))
      })

      it('can be blank', function () {
        rsvp.additionalNotes = ''
        return dal.insertRSVP(rsvp)
        .then(() => assert(db.query.calledOnce))
      })

      it('cannot be a non-string', function () {
        rsvp.additionalNotes = 1
        return assertInsertFails(rsvp)
      })
    })
  })
})
