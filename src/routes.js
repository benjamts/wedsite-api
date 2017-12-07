const { AuthorizationError, ValidationError } = require('./validators')
const config = require('./config')
const dal = require('./dal')
const express = require('express')

const router = new express.Router()

router.use(require('body-parser').json())
router.get('/_health', (req, res) => res.sendStatus(200))
router.get('/_db_health', function (req, res) {
  return dal._health()
  .then(() => res.sendStatus(200))
  .catch(err => res.status(502).send(err))
})

router.post('/rsvp', function (req, res, next) {
  return Promise.resolve().then(function () {
    const {
      inviteCode,
      numberOfAttendees,
      attendees,
      additionalNotes
    } = req.body

    if (inviteCode !== config.INVITE_CODE) {
      throw new AuthorizationError('Sorry, I don\'t recognize this code. Please double-check that it matches the one on your paper invitation (case matters).')
    } else if (
      numberOfAttendees < 1 ||
      numberOfAttendees !== attendees.length
    ) {
      throw new ValidationError('numberOfAttendees mismatch')
    }

    return {
      additionalNotes,
      attendees
    }
  })
  .then(rsvp => dal.insertRsvp(rsvp))
  .then(newModels => res.status(201).json(newModels))
  .catch(next)
})

router.use(function (err, req, res, next) {
  if (res.headersSent) {
    next(err)
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message })
  } else if (err instanceof AuthorizationError) {
    return res.status(401).json({ message: err.message })
  } else {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router
