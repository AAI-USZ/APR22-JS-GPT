
var express = require('express'),
connect = require('connect');

module.exports = {
'test inheritance': function(assert){
var server = express.createServer();
assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
},

'test basic server': function(assert){
var server = express.createServer();

server.get('/', function(req, res){
assert.equal('test', server.set('env'), 'env setting was not set properly');
res.writeHead(200, {});
res.end('wahoo');
});

server.put('/user/:id', function(req, res, params){
res.writeHead(200, {});
res.end('updated user ' + params.id)
});

assert.response(server,
{ url: '/' },
{ body: 'wahoo' });

assert.response(server,
{ url: '/user/12', method: 'PUT' },
{ body: 'updated user 12' });
},

'test constructor middleware': function(assert, beforeExit){
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
assert.eql(['one', 'two'], calls);
});
},

'test #error()': function(assert){

var app = express.createServer();

app.get('/', function(req, res, params, next){
next(new Error('broken'));
});

app.use('/', connect.errorHandler());

assert.response(app,
{ url: '/' },
{ body: 'Internal Server Error' });


var app = express.createServer();

app.get('/', function(req, res, params, next){
next(new Error('broken'));
});

app.error(function(err, req, res){
res.send('Shit: ' + err.message, 500);
});

assert.response(app,
{ url: '/' },
{ body: 'Shit: broken', status: 500 });


var app = express.createServer();

app.get('/', function(req, res, params, next){
throw new Error('broken');
});
app.get('/foo', function(req, res, params, next){
throw new Error('oh noes');
});

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

assert.response(app,
{ url: '/' },
{ body: 'broken', status: 500 });
assert.response(app,
{ url: '/foo' },
{ body: 'Internal Server Error' });
},

'test next()': function(assert){
var app = express.createServer();

app.get('/user.:format?', function(req, res, params, next){
switch (params.format) {
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

'test #use()': function(assert){
var app = express.createServer();

app.get('/users', function(req, res, params, next){
next(new Error('fail!!'));
});
app.use('/', connect.errorHandler({ showMessage: true }));

assert.response(app,
{ url: '/users' },
{ body: 'Error: fail!!' });
},

'test #configure()': function(assert, beforeExit){
var calls = [];
process.env.EXPRESS_ENV = 'development';
var server = express.createServer();


var ret = server.configure(function(){
assert.equal(this, server, 'Test context of configure() is the server');
calls.push('any');
}).configure('development', function(){
calls.push('dev');
}).configure('production', function(){
calls.push('production');
});

assert.equal(ret, server, 'Test #configure() returns server for chaining');

assert.response(server,
{ url: '/' },
{ body: 'Cannot GET /' });

beforeExit(function(){
assert.eql(['any', 'dev'], calls);
});
},

'test #configure() immediate call': function(assert){
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

'test #configure() precedence': function(assert){
var app = express.createServer();

app.configure(function(){
app.use(function(req, res, next){
res.writeHead(200, {});
res.write('first');
next();
});
app.use(app.router);
app.use(function(req, res, next){
