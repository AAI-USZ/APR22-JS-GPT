var express = require('../')
, request = require('supertest');

describe('app', function(){
describe('.VERB()', function(){
it('should not get invoked without error handler on error', function(done) {
var app = express();

app.use(function(req, res, next){
next(new Error('boom!'))
});

app.get('/bar', function(req, res){
res.send('hello, world!');
});

request(app)
