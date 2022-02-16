var app = require('../../examples/auth/app')
, request = require('../support/http');

describe('auth', function(){
var cookie;
describe('GET /',function(){
it('should redirect to /login', function(done){
request(app)
.get('/')
.end(function(res){
res.statusCode.should.equal(302);
