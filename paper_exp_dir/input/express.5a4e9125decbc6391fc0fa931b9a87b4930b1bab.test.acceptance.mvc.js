
var request = require('supertest')
, app = require('../../examples/mvc');

describe('mvc', function(){
describe('GET /', function(){
it('should redirect to /users', function(done){
request(app)
.get('/')
.expect('Location', '/users')
.expect(302, done)
})
})

describe('GET /pet/0', function(){
it('should get pet', function(done){
request(app)
.get('/pet/0')
.expect(200, /Tobi/, done)
})
})

describe('GET /pet/0/edit', function(){
it('should get pet edit page', function(done){
request(app)
.get('/pet/0/edit')
.expect(/<form/)
.expect(200, /Tobi/, done)
})
})

describe('PUT /pet/2', function(){
it('should update the pet', function(done){
request(app)
.put('/pet/3')
