var app = require('../../examples/params/app')
var request = require('supertest')

describe('params', function(){
describe('GET /', function(){
it('should respond with instructions', function(done){
request(app)
.get('/')
.expect(/Visit/,done)
})
})

describe('GET /user/0', function(){
it('should respond with a user', function(done){
request(app)
.get('/user/0')
.expect(/user tj/,done)
})
})

describe('GET /user/9', function(){
it('should fail to find user', function(done){
request(app)
.get('/user/9')
.expect(/failed to find user/,done)
})
})

