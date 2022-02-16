
var after = require('after');
var assert = require('assert');
var express = require('..');
var request = require('supertest');

describe('res', function(){
describe('.download(path)', function(){
it('should transfer as an attachment', function(done){
var app = express();

app.use(function(req, res){
res.download('test/fixtures/user.html');
});

request(app)
.get('/')
.expect('Content-Type', 'text/html; charset=UTF-8')
.expect('Content-Disposition', 'attachment; filename="user.html"')
.expect(200, '<p>{{user.name}}</p>', done)
})
})

describe('.download(path, filename)', function(){
it('should provide an alternate filename', function(done){
var app = express();

app.use(function(req, res){
res.download('test/fixtures/user.html', 'document');
});

request(app)
.get('/')
.expect('Content-Type', 'text/html; charset=UTF-8')
.expect('Content-Disposition', 'attachment; filename="document"')
.expect(200, done)
})
})

describe('.download(path, fn)', function(){
it('should invoke the callback', function(done){
var app = express();
var cb = after(2, done);

app.use(function(req, res){
res.download('test/fixtures/user.html', cb);
});

request(app)
.get('/')
.expect('Content-Type', 'text/html; charset=UTF-8')
.expect('Content-Disposition', 'attachment; filename="user.html"')
.expect(200, cb);
})
})

describe('.download(path, filename, fn)', function(){
it('should invoke the callback', function(done){
var app = express();
var cb = after(2, done);

app.use(function(req, res){
res.download('test/fixtures/user.html', 'document', done);
});

request(app)
.get('/')
.expect('Content-Type', 'text/html; charset=UTF-8')
.expect('Content-Disposition', 'attachment; filename="document"')
.expect(200, cb);
})
})

describe('.download(path, filename, options, fn)', function () {
it('should invoke the callback', function (done) {
var app = express()
var cb = after(2, done)
var options = {}

app.use(function (req, res) {
res.download('test/fixtures/user.html', 'document', options, done)
})

