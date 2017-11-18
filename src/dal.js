const db = require('./db')
const sql = require('./sql-template-tag')
const {
  validate,
  isString,
  isNotBlank,
  isBool
} = require('./validators')

function _health () {
  return db.query(`SELECT 1;`)
}

function insertRsvp (rsvp) {
  return Promise.resolve().then(function () {
    const { additionalNotes, attendees } = rsvp

    validate('additionalNotes', additionalNotes)(isString)

    attendees.forEach(function (attendee) {
      const { name, isAttending } = attendee

      validate('name', name)(isString, isNotBlank)
      validate('isAttending', isAttending)(isBool)
    })

    const values = [additionalNotes]
    const querystring = sql`
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
        ${attendees.map(attendee => `
          (
            (SELECT id FROM new_rsvp),
            $${values.push(attendee.name)},
            $${values.push(attendee.isAttending)}
          )
        `).join(',')}
      RETURNING (SELECT id FROM new_rsvp);
    `

    return db.query(querystring, values)
    .then(function (result) {
      return result.rows[0]
    })
  })
}

module.exports = {
  _health,
  insertRsvp
}
