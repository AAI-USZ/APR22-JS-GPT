
var express = require('express'),
connect = require('connect');

module.exports = {
'test inheritance': function(assert){
var server = express.createServer();
assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
},

'test connect middleware autoloaders': function(assert){
assert.equal(express.errorHandler, connect.errorHandler);
},

'test basic server': function(assert){
var server = express.createServer();

server.get('/', function(req, res){
assert.equal('test', server.set('env'), 'env setting was not set properly');
res.writeHead(200, {});
res.end('wahoo');
});

server.put('/user/:id', function(req, res){
res.writeHead(200, {});
res.end('updated user ' + req.params.id)
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
