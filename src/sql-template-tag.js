module.exports = function sql (strings, ...values) {
  let sql = ''
  for (let i = 0; i < values.length; i++) {
    sql += strings[i]
    sql += values[i]
  }
  sql += strings[strings.length - 1]
  return sql.replace(/\s+/g, ' ').trim()
}
