


var express = require('express'),
connect = require('connect');

module.exports = {
'#isXMLHttpRequest': function(assert){
var app = express.createServer();

app.get('/isxhr', function(req, res, params){
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

'#header()': function(assert){
var app = express.createServer();

app.get('/', function(req, res){
assert.equal('foo.com', req.header('Host'));
assert.equal('foo.com', req.header('host'));
res.send('wahoo');
});

assert.response(app,
{ url: '/', headers: { Host: 'foo.com' }},
{ body: 'wahoo' });
},

'#accepts()': function(assert){
var app = express.createServer();

app.get('/all', function(req, res){
assert.strictEqual(true, req.accepts('html'));
assert.strictEqual(true, req.accepts('json'));
res.send('ok');
});

app.get('/', function(req, res){
assert.strictEqual(true, req.accepts('html'));
assert.strictEqual(true, req.accepts('text/html'));
