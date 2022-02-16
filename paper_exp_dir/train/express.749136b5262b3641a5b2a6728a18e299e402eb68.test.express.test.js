


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should');

module.exports = {
'test inheritance': function(){
var server = express.createServer();
server.should.be.an.instanceof(connect.Server);
},

'test connect middleware autoloaders': function(){
express.errorHandler.should.equal(connect.errorHandler);
},

'test basic server': function(){
var server = express.createServer();

server.get('/', function(req, res){
server.set('env').should.equal('test');
res.writeHead(200, {});
res.end('wahoo');
});

server.put('/user/:id', function(req, res){
res.writeHead(200, {});
res.end('updated user ' + req.params.id)
});

server.del('/something', function(req, res){
res.send('Destroyed');
});

server.delete('/something/else', function(req, res){
res.send('Destroyed');
});

server.all('/staff/:id', function(req, res, next){
req.staff = { id: req.params.id };
next();
});

server.get('/staff/:id', function(req, res){
res.send('GET Staff ' + req.staff.id);
});

server.post('/staff/:id', function(req, res){
res.send('POST Staff ' + req.staff.id);
});

server.all('*', function(req, res){
res.send('requested ' + req.url);
});

assert.response(server,
{ url: '/' },
{ body: 'wahoo' });

assert.response(server,
{ url: '/user/12', method: 'PUT' },
{ body: 'updated user 12' });

assert.response(server,
{ url: '/something', method: 'DELETE' },
{ body: 'Destroyed' });

assert.response(server,
{ url: '/something/else', method: 'DELETE' },
{ body: 'Destroyed' });

assert.response(server,
{ url: '/staff/12' },
{ body: 'GET Staff 12' });

assert.response(server,
{ url: '/staff/12', method: 'POST' },
{ body: 'POST Staff 12' });

assert.response(server,
{ url: '/foo/bar/baz', method: 'DELETE' },
{ body: 'requested /foo/bar/baz' });
},

'test constructor middleware': function(beforeExit){
var calls = [];

function one(req, res, next){
calls.push('one');
next();
}

function two(req, res, next){
calls.push('two');
next();
}

var app = express.createServer(one, two);
app.get('/', function(req, res){
res.writeHead(200, {});
res.end('foo bar');
});

assert.response(app,
{ url: '/' },
{ body: 'foo bar' });

beforeExit(function(){
calls.should.eql(['one', 'two']);
});
},

'test #error()': function(){

var app = express.createServer();

app.get('/', function(req, res, next){
next(new Error('broken'));
});

app.use('/', connect.errorHandler());

assert.response(app,
{ url: '/' },
{ body: 'Internal Server Error' });


var app = express.createServer();

app.error(function(err, req, res){
res.send('Shit: ' + err.message, 500);
});

app.get('/', function(req, res, next){
next(new Error('broken'));
});

assert.response(app,
{ url: '/' },
{ body: 'Shit: broken', status: 500 });


var app = express.createServer();

app.error(function(err, req, res, next){
if (err.message === 'broken') {
next(err);
} else {
res.send(500);
}
});

app.error(function(err, req, res, next){
res.send(err.message, 500);
});

app.get('/', function(req, res, next){
throw new Error('broken');
});
app.get('/foo', function(req, res, next){
throw new Error('oh noes');
});

assert.response(app,
{ url: '/' },
{ body: 'broken', status: 500 });
assert.response(app,
{ url: '/foo' },
{ body: 'Internal Server Error' });
},

'test next()': function(){
var app = express.createServer();

app.get('/user.:format?', function(req, res, next){
switch (req.params.format) {
case 'json':
res.writeHead(200, {});
res.end('some json');
break;
default:
next();
}
});

app.get('/user', function(req, res){
res.writeHead(200, {});
res.end('no json :)');
});

assert.response(app,
{ url: '/user.json' },
{ body: 'some json' });

assert.response(app,
{ url: '/user' },
{ body: 'no json :)' });
},

'test #use()': function(){
var app = express.createServer();

app.get('/users', function(req, res, next){
next(new Error('fail!!'));
});
app.use('/', connect.errorHandler({ showMessage: true }));

assert.response(app,
{ url: '/users' },
{ body: 'Error: fail!!' });
},

'test #configure()': function(beforeExit){
var calls = [];
process.env.NODE_ENV = 'development';
var server = express.createServer();


var ret = server.configure(function(){
assert.equal(this, server, 'Test context of configure() is the server');
calls.push('any');
}).configure('development', function(){
calls.push('dev');
}).configure('production', function(){
calls.push('production');
});

should.equal(ret, server, 'Test #configure() returns server for chaining');

assert.response(server,
{ url: '/' },
{ body: 'Cannot GET /' });

beforeExit(function(){
calls.should.eql(['any', 'dev']);
});
},

'test #configure() immediate call': function(){
var app = express.createServer();

app.configure(function(){
app.use(connect.bodyDecoder());
});

app.post('/', function(req, res){
res.send(req.param('name') || 'nope');
});

assert.response(app,
{ url: '/', method: 'POST', data: 'name=tj', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
{ body: 'tj' });
},

'test #configure() precedence': function(){
var app = express.createServer();

app.configure(function(){
app.use(function(req, res, next){
res.writeHead(200, {});
res.write('first');
next();
});
app.use(app.router);
app.use(function(req, res, next){
res.end('last');
});
});

app.get('/', function(req, res, next){
res.write(' route ');
next();
});

assert.response(app,
{ url: '/' },
{ body: 'first route last' });
},

'test #set()': function(){
var app = express.createServer();
var ret = app.set('title', 'My App').set('something', 'else');
ret.should.equal(app);
app.set('title').should.equal('My App');
app.set('something').should.equal('else');
},

'test #enable()': function(){
var app = express.createServer();
var ret = app.enable('some feature');
ret.should.equal(app);
app.set('some feature').should.be.true;
app.enabled('some feature').should.be.true;
app.enabled('something else').should.be.false;
},

'test #disable()': function(){
var app = express.createServer();
var ret = app.disable('some feature');
ret.should.equal(app);
app.set('some feature').should.be.false;
