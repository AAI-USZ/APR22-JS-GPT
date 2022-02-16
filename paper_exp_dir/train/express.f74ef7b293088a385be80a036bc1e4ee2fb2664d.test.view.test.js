


var express = require('express'),
connect = require('connect'),
view = require('express/view');

var create = function(){
var app = express.createServer.apply(express, arguments);
app.set('views', __dirname + '/fixtures');
return app;
};

module.exports = {
'test #render()': function(assert){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});
app.get('/jade', function(req, res){
res.render('index', { layout: false });
});
app.get('/haml', function(req, res){
res.render('hello.haml', { layout: false });
});
app.get('/callback/layout/no-options', function(req, res){
res.render('hello.jade', function(err, str){
assert.ok(!err);
res.send(str.replace(':(', ':)'));
});
});
app.get('/callback/layout', function(req, res){
res.render('hello.jade', {}, function(err, str){
assert.ok(!err);
res.send(str.replace(':(', ':)'));
});
});
app.get('/callback', function(req, res){
res.render('hello.haml', { layout: false }, function(err, str){
assert.ok(!err);
res.send(str.replace('Hello World', ':)'));
});
});
app.get('/invalid', function(req, res){
res.render('invalid.jade', { layout: false });
});
app.get('/invalid-async', function(req, res){
process.nextTick(function(){
res.render('invalid.jade', { layout: false });
});
});
app.get('/error', function(req, res){
res.render('invalid.jade', { layout: false }, function(err){
res.send(err.arguments[0]);
});
});
app.get('/absolute', function(req, res){
res.render(__dirname + '/fixtures/index.jade', { layout: false });
});

assert.response(app,
{ url: '/' },
{ body: '<p>Welcome</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
assert.response(app,
{ url: '/jade' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/absolute' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/haml' },
{ body: '\n<p>Hello World</p>' });
assert.response(app,
{ url: '/callback' },
{ body: '\n<p>:)</p>' });
assert.response(app,
{ url: '/callback/layout' },
{ body: '<html><body><p>:)</p></body></html>' });
assert.response(app,
{ url: '/callback/layout/no-options' },
{ body: '<html><body><p>:)</p></body></html>' });
assert.response(app,
{ url: '/error' },
{ body: 'doesNotExist' });
assert.response(app,
{ url: '/invalid' },
function(res){
assert.ok(res.body.indexOf('ReferenceError') >= 0);
assert.ok(res.body.indexOf('doesNotExist') >= 0);
});
assert.response(app,
{ url: '/invalid-async' },
function(res){
assert.ok(res.body.indexOf('ReferenceError') >= 0);
assert.ok(res.body.indexOf('doesNotExist') >= 0);
});

},

'test #render() layout': function(assert){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade');
});
app.get('/jade', function(req, res){
res.render('index');
});

assert.response(app,
{ url: '/' },
{ body: '<html><body><p>Welcome</p></body></html>' });
},

'test #render() specific layout': function(assert, beforeExit){
var app = create(),
called;

app.get('/', function(req, res){
res.render('index.jade', { layout: 'cool-layout.jade' }, function(err, html){
called = true;
res.send(html);
});
});
app.get('/no-ext', function(req, res){
res.render('index.jade', { layout: 'cool-layout' });
});
app.get('/relative', function(req, res){
res.render('index.jade', { layout: 'layouts/foo.jade' });
});
app.get('/absolute', function(req, res){
res.render('index.jade', { layout: __dirname + '/fixtures/layouts/foo.jade' });
});
app.get('/nope', function(req, res){
res.render('index.jade', { layout: 'nope.jade' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
assert.response(app,
{ url: '/no-ext' },
{ body: '<cool><p>Welcome</p></cool>' });
assert.response(app,
{ url: '/relative' },
{ body: '<foo></foo>' });
assert.response(app,
{ url: '/absolute' },
{ body: '<foo></foo>' });
assert.response(app,
{ url: '/nope' },
function(res){
assert.ok(res.body.indexOf('Error: ENOENT') >= 0);
assert.ok(res.body.indexOf('nope.jade') >= 0);
});

beforeExit(function(){
assert.ok(called, 'Layout callback never called');
});
},

'test #render() specific layout "view engine"': function(assert){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index', { layout: 'cool-layout' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
},

'test #render() scope': function(assert){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.internal = '1';
res.method = function(){
return this.internal;
};
res.render('scope.jade', { layout: false });
});

app.get('/custom', function(req, res){
var scope = {
internal: '2',
method: function(){
return this.internal;
}
};
res.render('scope.jade', { layout: false, scope: scope });
});

assert.response(app,
{ url: '/' },
{ body: '<p>1</p>'});

assert.response(app,
{ url: '/custom' },
{ body: '<p>2</p>'});
},

'test #render() status': function(assert){
var app = create();

app.get('/', function(req, res){
res.render('hello.jade', {
layout: false,
status: 404
});
});

assert.response(app,
{ url: '/' },
{ body: '<p>:(</p>', status: 404 });
},
