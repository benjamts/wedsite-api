/* eslint-env mocha */
const express = require('express')
const routes = require('../src/routes')
const request = require('supertest')

describe('Route', function () {
  const app = express()
  app.use(routes)

  describe('_health', function () {
    it('returns 200', function () {
      return request(app).get('/_health').expect(200)
    })
  })
})
