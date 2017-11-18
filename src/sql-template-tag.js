module.exports = function sql (strings) {
  return strings[0].replace(/\s+/g, ' ').trim()
}
