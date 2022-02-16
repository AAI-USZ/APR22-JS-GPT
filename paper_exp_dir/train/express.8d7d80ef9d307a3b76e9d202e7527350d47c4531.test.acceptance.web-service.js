
var request = require('supertest')
, app = require('../../examples/web-service');

describe('web-service', function(){
describe('GET /api/users', function(){
describe('without an api key', function(){
it('should respond with 400 bad request', function(done){
request(app)
.get('/api/users')
.expect(400, done);
})
})

describe('with an invalid api key', function(){
it('should respond with 401 unauthorized', function(done){
request(app)
.get('/api/users?api-key=rawr')
.expect(401, done);
})
})

describe('with a valid api key', function(){
it('should respond users json', function(done){
request(app)
.get('/api/users?api-key=foo')
.expect('Content-Type', 'application/json; charset=utf-8')
.expect(200, '[{"name":"tobi"},{"name":"loki"},{"name":"jane"}]', done)
})
})
})

describe('GET /api/repos', function(){
describe('without an api key', function(){
it('should respond with 400 bad request', function(done){
request(app)
