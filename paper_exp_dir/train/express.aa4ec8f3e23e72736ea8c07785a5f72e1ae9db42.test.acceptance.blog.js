
var app = require('../../examples/blog')
, request = require('../support/http');

var authorization = 'Basic ' + Buffer('admin:express').toString('base64');

function redirects(to,fn){
return function(res){
res.statusCode.should.equal(302)
res.headers.should.have.property('location').match(to);
