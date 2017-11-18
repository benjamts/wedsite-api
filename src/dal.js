const db = require('./db')
const sql = require('./sql-template-tag')
const {
  validate,
  isString,
  isInteger,
  isNotBlank,
  isBool
} = require('./validators')

function _health () {
  return db.query(`SELECT 1;`)
}

function insertAttendee (attendee) {
  return Promise.resolve().then(function () {
    const { rsvpId, name, isAttending } = attendee

    validate('rsvpId', rsvpId)(isInteger)
    validate('name', name)(isString, isNotBlank)
    validate('isAttending', isAttending)(isBool)

    return db.query(sql`
      INSERT INTO attendee
      (rsvp_id, name, is_attending)
      VALUES
      ($1, $2, $3);
    `, [
      rsvpId,
      name,
      isAttending
    ])
    .then(function (result) {
      return result.rows[0]
    })
  })
}

function insertRSVP (rsvp) {
  return Promise.resolve().then(function () {
    const { additionalNotes } = rsvp

    validate('additionalNotes', additionalNotes)(isString)

    return db.query(sql`
      INSERT INTO rsvp
      (additional_notes)
      VALUES
      ($1);
    `, [additionalNotes])
    .then(function (result) {
      return result.rows[0]
    })
  })
}

module.exports = {
  _health,
  insertAttendee,
  insertRSVP
}
