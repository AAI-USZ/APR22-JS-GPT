


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

'test .param()': function(){
var app = express.createServer();

var users = [
{ name: 'tj' }
, { name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
, { name: 'bandit' }
];

function integer(n){ return parseInt(n, 10); };
app.param(['to', 'from'], integer);

app.param('user', function(req, res, next, id){
if (req.user = users[id]) {
next();
} else {
next(new Error('failed to find user'));
}
});

app.get('/user/:user', function(req, res, next){
res.send('user ' + req.user.name);
});

app.get('/users/:from-:to', function(req, res, next){
var names = users.slice(req.params.from, req.params.to).map(function(user){
return user.name;
});
res.send('users ' + names.join(', '));
});

assert.response(app,
{ url: '/user/0' },
{ body: 'user tj' });

assert.response(app,
{ url: '/user/1' },
{ body: 'user tobi' });

assert.response(app,
{ url: '/users/0-3' },
{ body: 'users tj, tobi, loki' });
},

'test .param() ret val': function(){
var app = express.createServer();

app.param('uid', parseInt);

app.get('/user/:uid', function(req, res, next){
var id = req.params.uid;
res.send('loaded user ' + id + ' as typeof ' + typeof id);
});

app.param('name', function(name){
var captures;
if (captures = /^\w[\w\d]+/.exec(name)) {
return captures[0];
}
});

app.get('/user/:name', function(req, res, next){
var name = req.params.name;
res.send('loaded user ' + name);
});

assert.response(app,
{ url: '/user/0' },
{ body: 'loaded user 0 as typeof number' });

assert.response(app,
{ url: '/user/tj' },
{ body: 'loaded user tj' });

assert.response(app,
{ url: '/user/t' },
{ status: 404 });
},

'test OPTIONS': function(){
var app = express.createServer();

app.get('/', function(){});
app.get('/user/:id', function(){});
app.put('/user/:id', function(){});

assert.response(app,
{ url: '/', method: 'OPTIONS' },
{ headers: { Allow: 'GET' }});

assert.response(app,
{ url: '/user/12', method: 'OPTIONS' },
{ headers: { Allow: 'GET,PUT' }});
},

'test app.lookup': function(){
var app = express.createServer();
app.get('/user', function(){});
app.get('/user/:id', function(){});
app.get('/user/:id/:op?', function(){});
app.put('/user/:id', function(){});
app.get('/user/:id/edit', function(){});

var route = app.get('/user/:id')[0]
route.should.be.an.instanceof(Route);
route.callback.should.be.a('function');
route.path.should.equal('/user/:id');
route.regexp.should.be.an.instanceof(RegExp);
route.method.should.equal('get');
route.keys.should.eql(['id']);

app.get('/user').should.have.length(1);
app.get('/user/:id').should.have.length(1);
app.get('/user/:id/:op?').should.have.length(1);
app.put('/user/:id').should.have.length(1);
app.get('/user/:id/edit').should.have.length(1);
app.get('/').should.have.be.empty;
app.all('/user/:id').should.have.length(2);

app.lookup.get('/user').should.have.length(1);
app.lookup.get('/user/:id').should.have.length(1);
app.lookup.get('/user/:id/:op?').should.have.length(1);
app.lookup.put('/user/:id').should.have.length(1);
app.lookup.get('/user/:id/edit').should.have.length(1);
app.lookup.get('/').should.have.be.empty;
app.lookup.all('/user/:id').should.have.length(2);
app.lookup('/user/:id').should.have.length(2);
},

'test app.remove': function(){
var app = express.createServer();
app.get('/user', function(){});
app.get('/user', function(){});
app.put('/user', function(){});

app.get('/user').should.have.length(2);
var removed = app.remove.get('/user');
removed.should.have.length(2);

var removed = app.remove.get('/user');
removed.should.have.length(0);
app.get('/user').should.have.length(0);

app.get('/user/:id', function(){});
app.put('/user/:id', function(){});
app.del('/user/:id', function(){});

app.remove.all('/user/:id').should.have.length(3);
app.remove.all('/user/:id').should.have.length(0);

app.get('/user/:id', function(){});
app.put('/user/:id', function(){});
app.del('/user/:id', function(){});

app.remove('/user/:id').should.have.length(3);
},

'test app.match': function(){
var app = express.createServer();
app.get('/user', function(){});
app.get('/user/:id', function(){});
app.get('/user/:id/:op?', function(){});
app.put('/user/:id', function(){});
app.get('/user/:id/edit', function(){});

var route = app.match.get('/user/12')[0];
route.should.be.an.instanceof(Route);
route.callback.should.be.a('function');
route.path.should.equal('/user/:id');
route.regexp.should.be.an.instanceof(RegExp);
route.method.should.equal('get');
route.keys.should.eql(['id']);


app.match.get('/user').should.have.length(1);
app.match.get('/user/12').should.have.length(2);
app.match.get('/user/12/:op?').should.have.length(1);
app.match.put('/user/100').should.have.length(1);
app.match.get('/user/5/edit').should.have.length(2);
app.match.get('/').should.have.be.empty;
app.match.all('/user/123').should.have.length(3);
app.match('/user/123').should.have.length(3);
},

'test Collection': function(){
var app = express.createServer();
app.get('/user', function(){});
app.get('/user/:id', function(){});
app.get('/user/:id/:op?', function(){});
app.put('/user/:id', function(){});
app.get('/user/:id/edit', function(){});

var ret = app.match.all('/user/12').remove();
ret.should.have.length(3);
app.match.all('/user/12').should.have.length(0);
