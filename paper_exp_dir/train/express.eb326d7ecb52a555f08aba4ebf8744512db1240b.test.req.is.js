
var express = require('..')
var request = require('supertest')

describe('req.is()', function () {
describe('when given a mime type', function () {
it('should return the type when matching', function (done) {
var app = express()

app.use(function (req, res) {
res.json(req.is('application/json'))
})
