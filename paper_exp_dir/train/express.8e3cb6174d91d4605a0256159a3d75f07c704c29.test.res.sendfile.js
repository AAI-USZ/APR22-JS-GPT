
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

it('should invoke the callback on 404', function(done){
var app = express()
, calls = 0;

app.use(function(req, res){
res.sendfile('test/fixtures/nope.html', function(err){
assert(!res.headerSent);
++calls;
res.send(err.message);
});
});

request(app)
.get('/')
.end(function(res){
calls.should.equal(1);
res.body.should.equal('Not Found');
res.statusCode.should.equal(200);
done();
});
})

it('should not override manual content-types', function(done){
var app = express();

app.use(function(req, res){
res.contentType('txt');
res.sendfile('test/fixtures/user.html');
});

request(app)
.get('/')
