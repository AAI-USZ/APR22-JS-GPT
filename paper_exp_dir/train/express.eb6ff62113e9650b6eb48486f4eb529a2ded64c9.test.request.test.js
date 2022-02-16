


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should');

module.exports = {
'test #isXMLHttpRequest': function(){
var app = express.createServer();

app.get('/isxhr', function(req, res){
assert.equal(req.xhr, req.isXMLHttpRequest);
res.send(req.isXMLHttpRequest
? 'yeaaa boy'
: 'nope');
});

assert.response(app,
{ url: '/isxhr' },
{ body: 'nope' });

assert.response(app,
{ url: '/isxhr', headers: { 'X-Requested-With': 'XMLHttpRequest' } },
{ body: 'yeaaa boy' });
},

'test #header()': function(){
var app = express.createServer();

app.get('/', function(req, res){
req.header('Host').should.equal('foo.com');
req.header('host').should.equal('foo.com');
res.send('wahoo');
});

assert.response(app,
{ url: '/', headers: { Host: 'foo.com' }},
{ body: 'wahoo' });
},

'test #accepts()': function(){
var app = express.createServer();

app.get('/all', function(req, res){
req.accepts('html').should.be.true;
req.accepts('.html').should.be.true;
req.accepts('json').should.be.true;
req.accepts('.json').should.be.true;
res.send('ok');
});

app.get('/', function(req, res){
req.accepts('html').should.be.true;
req.accepts('.html').should.be.true;
req.accepts('text/html').should.be.true;
req.accepts('text/*').should.be.true;
req.accepts('json').should.be.true;
req.accepts('application/json').should.be.true;

req.accepts('xml').should.be.false;
req.accepts('image/*').should.be.false;
req.accepts('png').should.be.false;
req.accepts().should.be.false;
res.send('ok');
});

app.get('/type', function(req, res){
req.accepts('html').should.be.true;
req.accepts('text/html').should.be.true;
req.accepts('json').should.be.true;
req.accepts('application/json').should.be.true;

req.accepts('png').should.be.false;
req.accepts('image/png').should.be.false;
res.send('ok');
});

assert.response(app,
{ url: '/all', headers: { Accept: '*/*' }},
{ body: 'ok' });
assert.response(app,
{ url: '/type', headers: { Accept: 'text/*; application/*' }},
{ body: 'ok' });
assert.response(app,
{ url: '/', headers: { Accept: 'text/html; application/json; text/*' }},
{ body: 'ok' });
},

'test #param()': function(){
var app = express.createServer(
connect.bodyParser()
);

app.get('/user/:id?', function(req, res){
res.send('user ' + req.param('id', 'unknown'));
});

app.post('/user', function(req, res){
res.send('user ' + req.param('id'));
});

app.get('/:sort', function(req, res){
res.send('sort ' + req.param('sort'));
});

assert.response(app,
{ url: '/asc' },
{ body: 'sort asc' });

assert.response(app,
{ url: '/user/12' },
{ body: 'user 12' });

assert.response(app,
{ url: '/user?id=5' },
{ body: 'user 5' });

