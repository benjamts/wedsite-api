exports.up = (pgm) => {
  pgm.createTable('rsvp', {
    id: 'id',
    additionalNotes: {
      type: 'string'
    },
    created_at: {
      default: pgm.func('CURRENT_TIMESTAMP'),
      type: 'datetime'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('rsvp')
}
