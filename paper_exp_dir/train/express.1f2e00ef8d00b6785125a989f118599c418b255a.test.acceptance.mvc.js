
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
.send({ pet: { name: 'Boots' } })
.end(function(err, res){
if (err) return done(err);
request(app)
.get('/pet/3/edit')
.expect(200, /Boots/, done)
})
})
})

describe('GET /users', function(){
it('should display a list of users', function(done){
request(app)
.get('/users')
.expect(/<h1>Users<\/h1>/)
.expect(/>TJ</)
.expect(/>Guillermo</)
.expect(/>Nathan</)
.expect(200, done)
})
})

describe('GET /user/:id', function(){
describe('when present', function(){
it('should display the user', function(done){
