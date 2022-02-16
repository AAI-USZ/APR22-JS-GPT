
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path, fn)', function(){
it('should invoke the callback when complete', function(done){
var app = express()
, calls = 0;

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', function(err){
assert(!err);
++calls;
});
});

request(app)
.get('/')
.end(function(res){
calls.should.equal(1);
res.statusCode.should.equal(200);
done();
});
})

it('should utilize the same options as express.static()', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', { maxAge: 60000 });
});

request(app)
.get('/')
.end(function(res){
