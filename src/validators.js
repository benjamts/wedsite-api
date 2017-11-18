class AuthorizationError extends Error {
  constructor (message, extra) {
    super(...arguments)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'AuthorizationError'
    this.message = message
    if (extra) {
      this.extra = extra
    }
  }
}

class ValidationError extends Error {
  constructor (message, extra) {
    super(...arguments)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'ValidationError'
    this.message = message
    if (extra) {
      this.extra = extra
    }
  }
}

function validate (fieldDescription, value) {
  return function (...validators) {
    validators.forEach(function (v) {
      if (!v.fn(value)) {
        throw new ValidationError(v.message(fieldDescription))
      }
    })
  }
}

const isInteger = {
  fn: function (v) {
    return Object.prototype.toString.call(v) === '[object Number]' &&
    Number.isFinite(v) &&
    Math.floor(v) === v &&
    v < Number.MAX_SAFE_INTEGER &&
    v > Number.MIN_SAFE_INTEGER
  },
  message: fieldDescription => `${fieldDescription} must be an integer`
}

const isBool = {
  fn: v => Object.prototype.toString.call(v) === '[object Boolean]',
  message: fieldDescription => `${fieldDescription} must be a boolean`
}

const isString = {
  fn: v => Object.prototype.toString.call(v) === '[object String]',
  message: fieldDescription => `${fieldDescription} must be a string`
}

const isNotBlank = {
  fn: v => v.trim().length > 0,
  message: fieldDescription => `${fieldDescription} cannot be blank`
}

module.exports = {
  AuthorizationError,
  isBool,
  isInteger,
  isNotBlank,
  isString,
  validate,
  ValidationError
}
