/* eslint-env mocha */
const dal = require('../src/dal')
const express = require('express')
const routes = require('../src/routes')
const request = require('supertest')
const sinon = require('sinon')

describe('Route', function () {
  const app = express()
  app.use(routes)

  describe('_health', function () {
    const endpoint = '/_health'
    it('returns 200', function () {
      return request(app).get(endpoint).expect(200)
    })
  })

  describe('_db_health', function () {
    const endpoint = '/_db_health'
    beforeEach(function () {
      sinon.stub(dal, '_health')
    })

    afterEach(function () {
      dal._health.restore()
    })

    it('returns 200 if the database can be queried', function () {
      dal._health.resolves()
      return request(app).get(endpoint).expect(200)
    })

    it('returns 502 if the database cannot be queried', function () {
      dal._health.rejects(new Error('ConnectionError'))
      return request(app).get(endpoint).expect(502)
    })
  })
})
