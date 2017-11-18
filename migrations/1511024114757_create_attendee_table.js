exports.up = (pgm) => {
  pgm.createTable('attendee', {
    id: 'id',
    full_name: {
      type: 'string',
      required: true
    },
    is_attending: {
      type: 'bool',
      required: true
    },
    rsvp_id: {
      type: 'int',
      references: 'rsvp',
      required: true
    },
    created_at: {
      default: pgm.func('CURRENT_TIMESTAMP'),
      type: 'datetime'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('attendee')
}
