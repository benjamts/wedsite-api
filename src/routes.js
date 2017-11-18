const express = require('express')


const router = new express.Router()

router.get('/_health', (req, res) => res.sendStatus(200))


module.exports = router
