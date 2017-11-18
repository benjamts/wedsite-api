exports.up = (pgm) => {
  pgm.createTable('rsvp', {
    id: 'id',
    additional_notes: {
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
