var app = require('../../examples/auth/app')
, request = require('../support/http');

function redirects(to,fn){
return function(res){
res.statusCode.should.equal(302)
res.headers.should.have.property('location').match(to);
fn()
}
}

function getCookie(res) {
return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
var cookie;

describe('GET /',function(){
it('should redirect to /login', function(done){
request(app)
