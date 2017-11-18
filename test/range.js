/* eslint-env mocha */
const assert = require('assert')
const range = require('../src/range')

describe('range', function () {
  it('returns an array with numbers from start, inclusive, to end, exclusive', function () {
    assert.deepEqual(range(0, 4), [0, 1, 2, 3])
  })

  it('can start at a number greater than 0', function () {
    assert.deepEqual(range(10, 14), [10, 11, 12, 13])
  })

  it('can do ranges in the negatives', function () {
    assert.deepEqual(range(-5, -1), [-5, -4, -3, -2])
  })

  it('can do ranges that cross 0', function () {
    assert.deepEqual(range(-2, 2), [-2, -1, 0, 1])
  })
})
