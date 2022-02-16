
var app = require('../../examples/cookies/app')
, request = require('supertest');

describe('cookies', function(){
describe('GET /', function(){
it('should have a form', function(done){
request(app)
.get('/')
.expect(/<form/, done);
})

it('should respond with no cookies', function(done){
request(app)
.get('/')
.end(function(err, res){
res.headers.should.not.have.property('set-cookie')
done()
})
})

it('should respond to cookie', function(done){
request(app)
.post('/')
.send({ remember: 1 })
.expect(302, function(err, res){
if (err) return done(err)
request(app)
.get('/')
.set('Cookie', res.headers['set-cookie'][0])
