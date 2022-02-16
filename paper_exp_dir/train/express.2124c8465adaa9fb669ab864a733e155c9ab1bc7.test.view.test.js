


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, View = require('../lib/view')
, Partial = View.Partial



var create = function(){
var app = express.createServer.apply(express, arguments);
app.set('views', __dirname + '/fixtures');
return app;
};

module.exports = {
'test View#path': function(){
var view = new View('forum/thread.ejs', { root: '/www/mysite/views' });
view.path.should.equal('/www/mysite/views/forum/thread.ejs');

var view = new View('/www/mysite/views/path.ejs');
view.path.should.equal('/www/mysite/views/path.ejs');

var view = new View('user', { parentView: view });
view.path.should.equal('/www/mysite/views/user.ejs');

var view = new View('user/list', { parentView: view });
view.path.should.equal('/www/mysite/views/user/list.ejs');

var view = new View('user.jade', { parentView: new View('foo', { root: '/bar' }) });
view.path.should.equal('/bar/user.jade');

var view = new View('/foo.bar.baz/user.ejs');
view.path.should.equal('/foo.bar.baz/user.ejs');

var view = new View('/foo.bar.baz/user', { parentView: view });
view.path.should.equal('/foo.bar.baz/user.ejs');

var view = new View('user', { parentView: view });
view.path.should.equal('/foo.bar.baz/user.ejs');
},

'test View#engine': function(){
var view = new View('/absolute/path.ejs');
view.engine.should.equal('ejs');

var view = new View('user', { parentView: view });
view.engine.should.equal('ejs');

var view = new View('/user', { defaultEngine: 'jade' });
view.engine.should.equal('jade');

var view = new View('/foo.bar/user.ejs');
view.engine.should.equal('ejs');
},

'test View#extension': function(){
var view = new View('/absolute/path.ejs');
view.extension.should.equal('.ejs');

var view = new View('user', { parentView: view });
view.extension.should.equal('.ejs');

var view = new View('/user', { defaultEngine: 'jade' });
view.extension.should.equal('.jade');

var view = new View('/foo.bar/user.ejs');
view.extension.should.equal('.ejs');
},

'test View#dirname': function(){
var view = new View('/absolute/path.ejs');
view.dirname.should.equal('/absolute');

var view = new View('user', { parentView: view });
view.dirname.should.equal('/absolute');
},

'test View#contents': function(){
var view = new View(__dirname + '/fixtures/hello.jade');
view.contents.should.equal('p :(');
},

'test View#templateEngine': function(){
var view = new View(__dirname + '/fixtures/hello.jade');
view.templateEngine.should.equal(require('jade'));
},

'test Partial.resolveObjectName()': function(){
var resolve = Partial.resolveObjectName;
resolve('/path/to/user.ejs').should.equal('user');
resolve('/path/to/user-post.ejs').should.equal('userPost');
resolve('/path/to/user   post.ejs').should.equal('userPost');
resolve('forum thread post.ejs').should.equal('forumThreadPost');
resolve('forum   thread post.ejs').should.equal('forumThreadPost');
},

'test Partial#path for partials': function(){
var fixtures = __dirname + '/fixtures';

var view = new Partial('user.jade', { root: fixtures });
view.path.should.equal(fixtures + '/user.jade');

var view = new Partial('user', { parentView: view, root: fixtures });
view.path.should.equal(fixtures + '/user.jade');

var view = new Partial('forum/thread', { parentView: view });
view.path.should.equal(fixtures + '/forum/thread.jade');

var view = new Partial('forum/thread.jade', { root: fixtures });
view.path.should.equal(fixtures + '/forum/thread.jade');

var view = new Partial('thread', { parentView: view });
view.path.should.equal(fixtures + '/forum/thread.jade');
},

'test #render()': function(){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});

app.get('/jade', function(req, res){
res.render('index', { layout: false });
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

app.get('/ferret', function(req, res){
res.render('ferret', { layout: false, ferret: { name: 'Tobi' }});
});

assert.response(app,
{ url: '/ferret' },
{ body: '<li class="ferret">Tobi</li>' });
assert.response(app,
{ url: '/' },
{ body: '<p>Welcome</p>', headers: { 'Content-Type': 'text/html' }});
assert.response(app,
{ url: '/jade' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/absolute' },
{ body: '<p>Welcome</p>' });






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

'test #render() layout': function(){
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

'test #render() specific layout': function(beforeExit){
var app = create()
, called;

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
assert.ok(~res.body.indexOf('Error: E'));
assert.ok(~res.body.indexOf('nope/index.jade'));
});

beforeExit(function(){
assert.ok(called, 'Layout callback never called');
});
},

'test #render() specific layout "view engine"': function(){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index', { layout: 'cool-layout' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
},

'test #render() "view engine" with periods in dirname': function(){
var app = create();
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index', { layout: __dirname + '/fixtures/user/../cool-layout' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
},

'test #render() view helpers': function(beforeExit){
var app = create()
, calls = 0;

app.locals({
lastName: 'holowaychuk'
});

app.helpers({
greetings: function(sess, lastName){
return 'Hello ' + sess.name + ' ' + lastName;
