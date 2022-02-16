
var express = require('..');
var request = require('supertest')

describe('req', function(){
describe('.range(size)', function(){
it('should return parsed ranges', function (done) {
var app = express()

app.use(function (req, res) {
res.json(req.range(120))
