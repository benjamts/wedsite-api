const db = require('./db')

function _health () {
  return db.query(`SELECT 1;`)
}

module.exports = {
  _health
}
