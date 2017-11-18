/* eslint-env mocha */
const assert = require('assert')
const {
  isBool,
  isInteger,
  isNotBlank,
  isString,
  validate,
  ValidationError
} = require('../src/validators')

describe('Validators', function () {
  describe('ValidationError', function () {
    function doSomethingBad () {
      throw new ValidationError('It went bad!', 42)
    }

    let err
    beforeEach(function () {
      try {
        doSomethingBad()
      } catch (e) {
        err = e
      }
    })

    it('The name property should be set to the error\'s name', function () {
      assert(err.name = 'ValidationError')
    })

    it('The error should be an instance of its class', function () {
      assert(err instanceof ValidationError)
    })

    it('The error should be an instance of builtin Error', function () {
      assert(err instanceof Error)
    })

    it('The error should be recognized by Node.js\' util#isError', function () {
      assert(require('util').isError(err))  // eslint-disable-line node/no-deprecated-api
    })

    it('The error should have recorded a stack', function () {
      assert(err.stack)
    })

    it('toString should return the default error message formatting', function () {
      assert.strictEqual(err.toString(), 'ValidationError: It went bad!')
    })

    it('The stack should start with the default error message formatting', function () {
      assert.strictEqual(err.stack.split('\n')[0], 'ValidationError: It went bad!')
    })

    it('The first stack frame should be the function where the error was thrown.', function () {
      assert.strictEqual(err.stack.split('\n')[1].indexOf('doSomethingBad'), 7)
    })

    it('The extra property should have been set', function () {
      assert.strictEqual(err.extra, 42)
    })
  })

  describe('validate', function () {
    it('should noop if the value passes all validators', function () {
      validate('truth', true)(isBool)
      assert.ok(true)
    })

    it('should throw a ValidationError if any of the validators fails', function () {
      assert.throws(
        () => validate('fooField', '')(isString, isNotBlank),
        ValidationError,
        isBool.message('fooField')
      )
    })

    it('should throw a ValidationError if one of many validators fails', function () {
      assert.throws(
        () => validate('fooField', '')(isString, isNotBlank),
        ValidationError,
        isNotBlank.message('fooField')
      )
    })
  })

  describe('isString', function () {
    describe('fn', function () {
      it('returns true if passed a string', function () {
        assert.equal(isString.fn(''), true)
        assert.equal(isString.fn('foobar'), true)
        assert.equal(isString.fn(new String()), true)  // eslint-disable-line no-new-wrappers
      })

      it('returns false if passed anything except a string', function () {
        assert.equal(isString.fn(true), false)
        assert.equal(isString.fn(false), false)
        assert.equal(isString.fn(0), false)
        assert.equal(isString.fn([]), false)
        assert.equal(isString.fn({}), false)
        assert.equal(isString.fn(0), false)
        assert.equal(isString.fn(NaN), false)
        assert.equal(isString.fn(null), false)
        assert.equal(isString.fn(undefined), false)
        assert.equal(isString.fn(/foo/), false)
        assert.equal(isString.fn(new Date()), false)
        assert.equal(isString.fn(function () {}), false)
      })
    })

    describe('message', function () {
      it('says the field must be a string', function () {
        assert.equal(isString.message('Yarn'), 'Yarn must be a string')
      })
    })
  })

  describe('isNotBlank', function () {
    describe('fn', function () {
      it('returns true if passed a string with non-whitespace characters', function () {
        assert.equal(isNotBlank.fn('foo'), true)
        assert.equal(isNotBlank.fn(' foo'), true)
        assert.equal(isNotBlank.fn('   foo   '), true)
      })

      it('returns false if passed a string with nothing but whitespace characters', function () {
        assert.equal(isNotBlank.fn(''), false)
        assert.equal(isNotBlank.fn(' '), false)
        const WHITESPACE = [
          '\f',
          '\n',
          '\r',
          '\t',
          '\u0009',
          '\u000B',
          '\u000C',
          '\u000D',
          '\u0020',
          '\v'
        ].join('')
        assert.equal(isNotBlank.fn(WHITESPACE), false)
      })
    })

    describe('message', function () {
      it('says the field must not be blank', function () {
        assert.equal(isNotBlank.message('Stares'), 'Stares cannot be blank')
      })
    })
  })

  describe('isBool', function () {
    describe('fn', function () {
      it('returns true if passed a string', function () {
        assert.equal(isBool.fn(false), true)
        assert.equal(isBool.fn(true), true)

        /* eslint-disable no-new-wrappers */
        assert.equal(isBool.fn(new Boolean()), true)
        assert.equal(isBool.fn(new Boolean(false)), true)
        assert.equal(isBool.fn(new Boolean(true)), true)
        /* eslint-enable no-new-wrappers */
      })

      it('returns false if passed anything except a string', function () {
        assert.equal(isBool.fn(''), false)
        assert.equal(isBool.fn(0), false)
        assert.equal(isBool.fn([]), false)
        assert.equal(isBool.fn({}), false)
        assert.equal(isBool.fn(0), false)
        assert.equal(isBool.fn(NaN), false)
        assert.equal(isBool.fn(null), false)
        assert.equal(isBool.fn(undefined), false)
        assert.equal(isBool.fn(/foo/), false)
        assert.equal(isBool.fn(new Date()), false)
        assert.equal(isBool.fn(function () {}), false)
      })
    })

    describe('message', function () {
      it('says the field must be a boolean', function () {
        assert.equal(isBool.message('Igotnothin'), 'Igotnothin must be a boolean')
      })
    })
  })

  describe('isInteger', function () {
    describe('fn', function () {
      it('returns true if passed an integer', function () {
        assert.equal(isInteger.fn(0), true)
        assert.equal(isInteger.fn(1), true)
        assert.equal(isInteger.fn(100000), true)
        assert.equal(isInteger.fn(Number.MAX_SAFE_INTEGER - 1), true)
        assert.equal(isInteger.fn(Number.MIN_SAFE_INTEGER + 1), true)
      })

      it('returns false if passed anything except an integer', function () {
        assert.equal(isInteger.fn(''), false)
        assert.equal(isInteger.fn([]), false)
        assert.equal(isInteger.fn({}), false)
        assert.equal(isInteger.fn(NaN), false)
        assert.equal(isInteger.fn(1.1), false)
        assert.equal(isInteger.fn(Infinity), false)
        assert.equal(isInteger.fn(-Infinity), false)
        assert.equal(isInteger.fn(Number.MAX_SAFE_INTEGER), false)
        assert.equal(isInteger.fn(Number.MIN_SAFE_INTEGER), false)
        assert.equal(isInteger.fn(null), false)
        assert.equal(isInteger.fn(undefined), false)
        assert.equal(isInteger.fn(/foo/), false)
        assert.equal(isInteger.fn(new Date()), false)
        assert.equal(isInteger.fn(function () {}), false)
      })
    })

    describe('message', function () {
      it('says the field must be a boolean', function () {
        assert.equal(isInteger.message('"Float On"'), '"Float On" must be an integer')
      })
    })
  })
})
