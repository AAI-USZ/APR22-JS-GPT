var app = require('../../examples/error-pages')
, request = require('../support/http');

describe('error-pages', function(){
describe('GET /', function(){
it('should respond with page list', function(done){
request(app)
.get('/')
.expect(/Pages Example/,done)
})
})

describe('Accept: text/html',function(){
describe('GET /403', function(){
it('should respond with 403', function(done){
request(app)
.get('/403')
.expect(403,done)
})
})

describe('GET /404', function(){
it('should respond with 404', function(done){
request(app)
.get('/404')
.expect(404,done)
})
})

describe('GET /500', function(){
