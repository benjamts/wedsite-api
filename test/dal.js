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

  describe('insertRsvp', function () {
    let rsvp
    let newRsvp
    beforeEach(function () {
      rsvp = {
        additionalNotes: 'foobar',
        attendees: [
          {
            name: 'Foo McBarson',
            isAttending: true
          },
          {
            name: 'Baz McBarson',
            isAttending: false
          }
        ]
      }

      newRsvp = { id: 100 }
      db.query.resolves({
        command: 'INSERT',
        fields: Object.keys(newRsvp),
        rowCount: 1,
        rows: [newRsvp]
      })
    })

    function assertInsertFails (rsvp) {
      return dal.insertRsvp(rsvp)
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
        return dal.insertRsvp(rsvp)
        .then(function () {
          const [querystring, values] = db.query.args[0]
          assert(db.query.calledOnce)
          assert.equal(querystring, sql`
            WITH new_rsvp AS (
              INSERT INTO rsvp
              (additional_notes)
              VALUES
              ($1)
              RETURNING id
            )
            INSERT INTO attendee
            (rsvp_id, full_name, is_attending)
            VALUES
              ( (SELECT id FROM new_rsvp), $2, $3 ),
              ( (SELECT id FROM new_rsvp), $4, $5 )
            RETURNING (SELECT id FROM new_rsvp);
          `)
          assert.deepEqual(values, [
            rsvp.additionalNotes,
            rsvp.attendees[0].name,
            rsvp.attendees[0].isAttending,
            rsvp.attendees[1].name,
            rsvp.attendees[1].isAttending
          ])
        })
      })

      it('resolving to the newly created rsvp info', function () {
        return dal.insertRsvp(rsvp)
        .then(res => assert.equal(res, newRsvp))
      })
    })

    describe('additionalNotes', function () {
      it('can be a string', function () {
        rsvp.additionalNotes = 'foo'
        return dal.insertRsvp(rsvp)
        .then(() => assert(db.query.calledOnce))
      })

      it('can be blank', function () {
        rsvp.additionalNotes = ''
        return dal.insertRsvp(rsvp)
        .then(() => assert(db.query.calledOnce))
      })

      it('cannot be a non-string', function () {
        rsvp.additionalNotes = 1
        return assertInsertFails(rsvp)
      })
    })

    describe('attendee', function () {
      let attendee
      beforeEach(function () {
        attendee = rsvp.attendees[1]
      })

      describe('name', function () {
        it('can be a string', function () {
          return dal.insertRsvp(rsvp)
          .then(() => assert(db.query.calledOnce))
        })

        it('cannot be a non-string', function () {
          delete attendee.name
          return assertInsertFails(rsvp)
        })

        it('cannot be blank', function () {
          attendee.name = '  '
          return assertInsertFails(rsvp)
        })
      })

      describe('isAttending', function () {
        it('can be true', function () {
          attendee.isAttending = true
          return dal.insertRsvp(rsvp)
          .then(() => assert(db.query.calledOnce))
        })

        it('can be false ...I guess :(', function () {
          attendee.isAttending = false
          return dal.insertRsvp(rsvp)
          .then(() => assert(db.query.calledOnce))
        })

        it('cannot be a non-Boolean', function () {
          attendee.isAttending = 'true'
          return assertInsertFails(rsvp)
        })
      })
    })
  })
})
