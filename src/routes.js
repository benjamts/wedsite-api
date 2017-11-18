const dal = require('./dal')
const express = require('express')

const router = new express.Router()

router.get('/_health', (req, res) => res.sendStatus(200))
router.get('/_db_health', function (req, res) {
  return dal._health()
  .then(() => res.sendStatus(200))
  .catch(err => res.status(502).send(err))
})

module.exports = router
