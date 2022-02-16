var app = require('../../examples/auth/app')
, request = require('../support/http');

function redirects(to,fn){
return function(res){
res.statusCode.should.equal(302)
res.headers.should.have.property('location').match(to);
fn()
}
}

describe('auth', function(){
var cookie;
