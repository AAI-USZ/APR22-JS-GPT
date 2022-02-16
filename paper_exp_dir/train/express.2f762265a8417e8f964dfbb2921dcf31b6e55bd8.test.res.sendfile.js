
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path)', function(){
describe('with an absolute path', function(){
it('should transfer the file', function(done){
var app = express();

app.use(function(req, res){
res.sendfile(__dirname + '/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>{{user.name}}</p>');
res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
done();
});
})
})

describe('with a relative path', function(){
it('should transfer the file', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>{{user.name}}</p>');
res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
done();
});
})

it('should serve relative to "root"', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('user.html', { root: 'test/fixtures/' });
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>{{user.name}}</p>');
res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
done();
});
})

it('should consider ../ malicious when "root" is not set', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/foo/../user.html');
});

request(app)
.get('/')
.end(function(res){
