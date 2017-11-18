const config = require('./src/config')
const express = require('express')

const app = express()

app.use(require('./src/routes'))

app.listen(config.PORT)
