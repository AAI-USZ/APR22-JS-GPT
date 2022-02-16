
var express = require('../')
, request = require('./support/http');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
res.end(method);
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})
});
})

it('should be .use()able', function(done){
var app = express();

var calls = [];

app.use(function(req, res, next){
calls.push('before');
next();
});

app.use(app.router);
