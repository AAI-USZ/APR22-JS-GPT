
var express = require('../')
, request = require('supertest');

describe('app', function(){
describe('.param(fn)', function(){
it('should map app.param(name, ...) logic', function(done){
var app = express();

app.param(function(name, regexp){
if (Object.prototype.toString.call(regexp) == '[object RegExp]') {
return function(req, res, next, val){
var captures;
if (captures = regexp.exec(String(val))) {
req.params[name] = captures[1];
next();
} else {
next('route');
}
}
}
})

app.param(':name', /^([a-zA-Z]+)$/);

app.get('/user/:name', function(req, res){
res.send(req.params.name);
});

request(app)
.get('/user/tj')
.end(function(err, res){
res.text.should.equal('tj');
request(app)
.get('/user/123')
.expect(404, done);
});

})

it('should fail if not given fn', function(){
var app = express();
app.param.bind(app, ':name', 'bob').should.throw();
})
})

describe('.param(names, fn)', function(){
it('should map the array', function(done){
var app = express();

app.param(['id', 'uid'], function(req, res, next, id){
id = Number(id);
if (isNaN(id)) return next('route');
req.params.id = id;
next();
});

app.get('/post/:id', function(req, res){
var id = req.params.id;
id.should.be.a.Number;
res.send('' + id);
});

app.get('/user/:uid', function(req, res){
var id = req.params.id;
id.should.be.a.Number;
res.send('' + id);
});

request(app)
.get('/user/123')
.end(function(err, res){
res.text.should.equal('123');

request(app)
.get('/post/123')
.expect('123', done);
})
})
})

describe('.param(name, fn)', function(){
it('should map logic for a single param', function(done){
var app = express();

app.param('id', function(req, res, next, id){
id = Number(id);
if (isNaN(id)) return next('route');
req.params.id = id;
next();
});

app.get('/user/:id', function(req, res){
var id = req.params.id;
id.should.be.a.Number;
res.send('' + id);
});

request(app)
.get('/user/123')
.expect('123', done);
})

it('should only call once per request', function(done) {
var app = express();
var called = 0;
var count = 0;

app.param('user', function(req, res, next, user) {
called++;
req.user = user;
next();
});

app.get('/foo/:user', function(req, res, next) {
count++;
next();
});
app.get('/foo/:user', function(req, res, next) {
count++;
next();
});
app.use(function(req, res) {
res.end([count, called, req.user].join(' '));
});

request(app)
.get('/foo/bob')
.expect('2 1 bob', done);
})

it('should call when values differ', function(done) {
var app = express();
var called = 0;
var count = 0;

app.param('user', function(req, res, next, user) {
called++;
req.users = (req.users || []).concat(user);
next();
});

app.get('/:user/bob', function(req, res, next) {
count++;
next();
});
app.get('/foo/:user', function(req, res, next) {
count++;
next();
});
app.use(function(req, res) {
res.end([count, called, req.users.join(',')].join(' '));
});

request(app)
.get('/foo/bob')
.expect('2 2 foo,bob', done);
})

var app = express();

