


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, MemoryStore = require('connect/middleware/session/memory');


var memoryStore = new MemoryStore({ reapInterval: -1 });

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
req.accepts('text/html').should.be.true;
req.accepts('text/*').should.be.true;
