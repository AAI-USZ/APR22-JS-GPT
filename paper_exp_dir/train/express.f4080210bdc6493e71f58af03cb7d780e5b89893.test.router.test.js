


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, Route = express.Route;

module.exports = {
'test route middleware': function(beforeExit){
var app = express.createServer()
, calls = 0;

function allow(role) {
return function(req, res, next) {


if (req.headers['x-role'] == role) {
next();
} else {
res.send(401);
}
}
}

function restrictAge(age) {
return function(req, res, next){
if (req.headers['x-age'] >= age) {
next();
} else {
res.send(403);
}
}
}

app.param('user', function(req, res, next, user){
++calls;
next();
});

app.get('/xxx', allow('member'), restrictAge(18), function(req, res){
res.send(200);
});

app.get('/booze', [allow('member')], restrictAge(18), function(req, res){
res.send(200);
});

app.get('/tobi', [allow('member')], [[restrictAge(18)]], function(req, res){
res.send(200);
});

app.get('/user/:user', [allow('member'), [[restrictAge(18)]]], function(req, res){
res.send(200);
});

['xxx', 'booze', 'tobi', 'user/tj'].forEach(function(thing){
assert.response(app,
{ url: '/' + thing },
{ body: 'Unauthorized', status: 401 });
assert.response(app,
{ url: '/' + thing, headers: { 'X-Role': 'member' }},
{ body: 'Forbidden', status: 403 });
assert.response(app,
{ url: '/' + thing, headers: { 'X-Role': 'member', 'X-Age': 18 }},
{ body: 'OK', status: 200 });
});

beforeExit(function(){
calls.should.equal(3);
});
},

'test precedence': function(){
var app = express.createServer();

var hits = [];

app.all('*', function(req, res, next){
hits.push('all');
next();
});

app.get('/foo', function(req, res, next){
hits.push('GET /foo');
next();
});

app.get('/foo', function(req, res, next){
hits.push('GET /foo2');
next();
});

app.put('/foo', function(req, res, next){
hits.push('PUT /foo');
next();
});

assert.response(app,
{ url: '/foo' },
function(){
hits.should.eql(['all', 'GET /foo', 'GET /foo2']);
});
},

'test named capture groups': function(){
var app = express.createServer();

app.get('/user/:id([0-9]{2,10})', function(req, res){
res.send('user ' + req.params.id);
});

app.post('/pin/save/:lat(\\d+.\\d+)/:long(\\d+.\\d+)', function(req, res){
res.send(req.params.lat + ' ' + req.params.long);
});

app.post('/pin/save2/:lat([0-9]+.[0-9]+)/:long([0-9]+.[0-9]+)', function(req, res){
res.send(req.params.lat + ' ' + req.params.long);
});

assert.response(app,
{ url: '/pin/save/1.2/3.4', method: 'POST' },
{ body: '1.2 3.4' });

assert.response(app,
{ url: '/pin/save2/1.2/3.4', method: 'POST' },
{ body: '1.2 3.4' });

assert.response(app,
{ url: '/user/12' },
{ body: 'user 12' });

assert.response(app,
{ url: '/user/ab' },
{ body: 'Cannot GET /user/ab' });
},

'test named capture group after dot': function(){
var app = express.createServer();

app.get('/user/:name.:format?', function(req, res){
res.send(req.params.name + ' - ' + (req.params.format || ''));
});

assert.response(app,
{ url: '/user/foo' },
{ body: 'foo - ' });

assert.response(app,
{ url: '/user/foo.json' },
{ body: 'foo - json' });

assert.response(app,
{ url: '/user/foo.bar.json' },
{ body: 'foo.bar - json' });
