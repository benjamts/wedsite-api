const config = require('./src/config')
const cors = require('cors');
const express = require('express')

const app = express()
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://tylerandsarah.com' : 'http://localhost:8080',
  optionsSuccessStatus: 200,
}))

app.options('*', cors())
app.use(require('./src/routes'))

app.listen(config.PORT)
