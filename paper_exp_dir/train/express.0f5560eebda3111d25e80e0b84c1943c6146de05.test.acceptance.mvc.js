
var request = require('../support/http')
, app = require('../../examples/mvc');

describe('mvc', function(){
describe('GET /', function(){
it('should redirect to /users', function(done){
request(app)
.get('/')
.end(function(err, res){
res.should.have.status(302);
res.headers.location.should.include('/users');
done();
})
})
})

describe('GET /users', function(){
it('should display a list of users', function(done){
request(app)
.get('/users')
.end(function(err, res){
res.text.should.include('<h1>Users</h1>');
res.text.should.include('>TJ<');
res.text.should.include('>Guillermo<');
res.text.should.include('>Nathan<');
done();
})
})
})

describe('GET /user/:id', function(){
describe('when present', function(){
it('should display the user', function(done){
request(app)
.get('/user/0')
.end(function(err, res){
res.text.should.include('<h1>TJ <a href="/user/0/edit">edit');
done();
})
})

it('should display the users pets', function(done){
request(app)
.get('/user/0')
.end(function(err, res){
res.text.should.include('/pet/0">Tobi');
