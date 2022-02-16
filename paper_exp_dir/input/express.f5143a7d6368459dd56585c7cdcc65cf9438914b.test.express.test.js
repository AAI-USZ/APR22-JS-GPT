
var express = require('express'),
connect = require('connect');

module.exports = {
'test .version': function(assert){
assert.ok(/^\d+\.\d+\.\d+$/.test(express.version), 'Test express.version format');
},

'test inheritance': function(assert){
var server = express.createServer();
assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
},

'test basic server': function(assert){
var server = express.createServer();

server.get('/', function(req, res){
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
var server = express.createServer();
process.env.EXPRESS_ENV = 'development';


var ret = server.configure(function(){
