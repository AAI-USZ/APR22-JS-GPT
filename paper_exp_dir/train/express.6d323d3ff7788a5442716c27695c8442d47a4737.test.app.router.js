var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
res.end();
} else {
res.end(method);
}
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})
});
})

it('should decode params', function(done){
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo%2Fbar')
.expect('foo/bar', done);
})

it('should be .use()able', function(done){
