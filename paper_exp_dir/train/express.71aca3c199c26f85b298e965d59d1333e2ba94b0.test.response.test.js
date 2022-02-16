


var express = require('express')
, Stream = require('stream').Stream
, assert = require('assert')
, should = require('should');

module.exports = {
'test #json()': function(){
var app = express.createServer()
, json = 'application/json; charset=utf-8';

app.get('/user', function(req, res, next){
res.json({ name: 'tj' });
});

app.get('/string', function(req, res, next){
res.json('whoop!');
});

app.get('/error', function(req, res, next){
res.json(500, 'oh noes!');
});

assert.response(app,
{ url: '/error' },
{ body: '"oh noes!"'
, status: 500
, headers: { 'Content-Type': json }});

assert.response(app,
{ url: '/string' },
{ body: '"whoop!"'
, headers: {
'Content-Type': json
, 'Content-Length': 8
}});

assert.response(app,
{ url: '/user' },
{ body: '{"name":"tj"}', headers: { 'Content-Type': json }});
},

'test #status()': function(){
var app = express.createServer();

app.get('/error', function(req, res, next){
res.status(500).send('OH NO');
});

assert.response(app,
{ url: '/error' },
{ body: 'OH NO', status: 500 });
},

'test #send()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
res.send('<p>test</p>');
});

app.get('/json', function(req, res){
res.header('X-Foo', 'bar');
res.send(201, { foo: 'bar' });
});

app.get('/text', function(req, res){
res.header('X-Foo', 'bar').contentType('txt');
res.send('wahoo');
});

app.get('/status', function(req, res){
res.send(404);
});

app.get('/status/text', function(req, res){
res.send(404, 'Oh noes!');
});

app.get('/error', function(req, res){
res.header('Content-Type', 'text/plain');
res.send(500, 'Oh shit!');
});

app.get('/buffer', function(req, res){
res.send(new Buffer('wahoo!'));
});

app.get('/204', function(req, res, next){
res.send(204);
});

app.get('/null', function(req, res, next){
res.send(null);
});

app.get('/undefined', function(req, res, next){
res.send(undefined);
});

app.get('/bool', function(req, res, next){
res.send(true);
});

assert.response(app,
{ url: '/bool' },
{ body: 'true'
, headers: { 'Content-Type': 'application/json; charset=utf-8' }});

assert.response(app,
{ url: '/html' },
{ body: '<p>test</p>'
, headers: {
'Content-Type': 'text/html; charset=utf-8'
}});

assert.response(app,
{ url: '/json' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json; charset=utf-8'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/text' },
{ body: 'wahoo'
, headers: {
'Content-Type': 'text/plain'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/status/text' },
{ body: 'Oh noes!', status: 404 });

assert.response(app,
{ url: '/status' },
{ body: 'Not Found'
, status: 404
, headers: { 'Content-Type': 'text/plain' }});

assert.response(app,
{ url: '/error' },
{ body: 'Oh shit!'
, status: 500
, headers: {
'Content-Type': 'text/plain'
, 'Content-Length': '8'
}});

assert.response(app,
{ url: '/buffer' },
{ body: 'wahoo!'
, headers: {
'Content-Type': 'application/octet-stream'
, 'Content-Length': '6'
}});

assert.response(app,
{ url: '/204' },
{ status: 204 }, function(res){
assert.equal(undefined, res.headers['content-type']);
assert.equal(undefined, res.headers['content-length']);
});

assert.response(app,
{ url: '/null' },
{ body: '' });

assert.response(app,
{ url: '/undefined' },
{ body: '' });

assert.response(app,
{ url: '/json?callback=test' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json; charset=utf-8'
, 'X-Foo': 'bar'
}});
},

'test #send() JSONP': function(){
var app = express.createServer();

app.enable('jsonp callback');

app.get('/jsonp', function(req, res){
res.header('X-Foo', 'bar');
res.send(201, { foo: 'bar' });
});

assert.response(app,
{ url: '/jsonp?callback=test' },
{ body: 'test({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/jsonp?callback=baz' },
{ body: 'baz({"foo":"bar"});'
, status: 201, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/jsonp?callback=invalid()[]' },
{ body: 'invalid({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});
},

'test #json() JSONP': function(){
var app = express.createServer();

app.enable('jsonp callback');

app.get('/jsonp', function(req, res){
res.header('X-Foo', 'bar');
res.json(201, { foo: 'bar' });
});

assert.response(app,
{ url: '/jsonp?callback=test' },
{ body: 'test({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/jsonp?callback=baz' },
{ body: 'baz({"foo":"bar"});'
, status: 201, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/jsonp?callback=invalid()[]' },
{ body: 'invalid({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'bar'
}});
},

'test #contentType()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
res.contentType('index.html');
res.writeHead(200, res.headers);
res.end('<p>yay</p>');
});

app.get('/json', function(req, res, next){
res.contentType('json');
res.send('{"foo":"bar"}');
});

app.get('/literal', function(req, res){
res.contentType('application/json');
res.send('{"foo":"bar"}')
});

assert.response(app,
{ url: '/literal' },
{ headers: { 'Content-Type': 'application/json' }});
assert.response(app,
{ url: '/html' },
{ body: '<p>yay</p>', headers: { 'Content-Type': 'text/html' }});
assert.response(app,
{ url: '/json' },
{ headers: { 'Content-Type': 'application/json' }});
},

'test #attachment()': function(){
var app = express.createServer();

app.get('/style.css', function(req, res){
res.attachment();
res.send('some stylezzz');
});

app.get('/*', function(req, res){
res.attachment(req.params[0]);
res.send('whatever');
});

assert.response(app,
{ url: '/javascripts/jquery.js' },
{ body: 'whatever'
, headers: { 'Content-Type': 'application/javascript'
, 'Content-Disposition': 'attachment; filename="jquery.js"' }});

assert.response(app,
{ url: '/style.css' },
{ body: 'some stylezzz'
, headers: { 'Content-Type': 'text/html; charset=utf-8'
, 'Content-Disposition': 'attachment' }});
},

'test #redirect()': function(){
var app = express.createServer()
, app2 = express.createServer();

app2.set('basepath', '/blog');

app2.redirect('google', 'http://google.com');

app2.redirect('blog', function(req, res){
return req.params.id
? '/user/' + req.params.id + '/posts'
: null;
});

app.get('/', function(req, res){
res.redirect('http://google.com', 301);
});

app.get('/back', function(req, res){
res.redirect('back');
});

app.get('/home', function(req, res){
res.redirect('home');
});

app.get('/html', function(req, res){
res.redirect('http://google.com');
});

app2.get('/', function(req, res){
res.redirect('http://google.com', 301);
});

app2.get('/back', function(req, res){
res.redirect('back');
});

app2.get('/home', function(req, res){
res.redirect('home');
});

app2.get('/google', function(req, res){
res.redirect('google');
});

app2.get('/user/:id', function(req, res){
res.header('X-Foo', 'bar');
res.redirect('blog');
});

assert.response(app,
{ url: '/html', headers: { Accept: 'text/html,text/plain', Host: 'foo.com' }},
{ body: '<p>Moved Temporarily. Redirecting to <a href="http://google.com">http://google.com</a></p>' });

assert.response(app,
{ url: '/', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Permanently. Redirecting to http://google.com'
, status: 301, headers: { Location: 'http://google.com' }});

assert.response(app,
{ url: '/back', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/'
, status: 302, headers: { Location: 'http://foo.com/', 'Content-Type': 'text/plain' }});

assert.response(app,
{ url: '/back', headers: { Referer: '/foo', Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/foo'
, status: 302, headers: { Location: 'http://foo.com/foo' }});

assert.response(app,
{ url: '/back', headers: { Referrer: '/foo', Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/foo'
, status: 302, headers: { Location: 'http://foo.com/foo' }});

assert.response(app,
{ url: '/home', headers: { Accept: 'text/plain', Host: 'foo.com' } },
{ body: 'Moved Temporarily. Redirecting to http://foo.com/'
, status: 302, headers: { Location: 'http://foo.com/' }});

assert.response(app2,
{ url: '/', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Permanently. Redirecting to http://google.com'
, status: 301, headers: { Location: 'http://google.com' }});

assert.response(app2,
{ url: '/back', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/blog'
, status: 302, headers: { Location: 'http://foo.com/blog' }});

assert.response(app2,
{ url: '/home', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/blog'
, status: 302, headers: { Location: 'http://foo.com/blog' }});

assert.response(app2,
{ url: '/google', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://google.com'
, status: 302, headers: { Location: 'http://google.com' }});

assert.response(app2,
{ url: '/user/12', headers: { Accept: 'text/plain', Host: 'foo.com' }},
{ body: 'Moved Temporarily. Redirecting to http://foo.com/blog/user/12/posts'
, status: 302, headers: { Location: 'http://foo.com/blog/user/12/posts', 'X-Foo': 'bar' }});
},

'test #redirect() when mounted': function(){
var app = express.createServer()
, blog = express.createServer();


blog.get('/posts', function(req, res){
res.redirect('/posts/all');
});

blog.get('/posts/all', function(req, res){
res.send('all blog posts');
});

app.use('/blog', blog);

assert.response(app,
{ url: '/blog/posts', headers: { Host: 'foo.com' }},
{ status: 302
, headers: { Location: 'http://foo.com/blog/posts/all' }});
},

'test #sendfile()': function(){
var app = express.createServer();

app.get('/*', function(req, res, next){
var file = req.params[0]
, path = __dirname + '/fixtures/' + file;
res.sendfile(path);
});

app.use(express.errorHandler());

assert.response(app,
{ url: '/../express.test.js' },
{ body: 'Forbidden', status: 403 });

assert.response(app,
{ url: '/user.json' },
{ body: '{"name":"tj"}'
, status: 200, headers: { 'Content-Type': 'application/json' }});

assert.response(app,
{ url: '/hello.haml' },
{ body: '%p Hello World'
, status: 200, headers: { 'Content-Type': 'application/octet-stream' }});

assert.response(app,
{ url: '/doesNotExist' },
{ body: 'Cannot GET /doesNotExist', status: 404 });

assert.response(app,
{ url: '/partials' },
{ body: 'Cannot GET /partials', status: 404 });

assert.response(app,
{ url: '/large.json' },
{ status: 200, headers: { 'Content-Type': 'application/json' }});
},

'test #sendfile(path, callback)': function(beforeExit){
var app = express.createServer()
, calls = 0;

app.get('/*', function(req, res, next){
var file = req.params[0]
, path = __dirname + '/fixtures/' + file;
res.sendfile(path, function(err){
if (err) return res.send('got an error');
++calls;
});
});

assert.response(app,
{ url: '/does-not-exist' },
{ body: 'Cannot GET /does-not-exist' });

assert.response(app,
{ url: '/large.json' },
{ headers: { 'Accept-Ranges': 'bytes' }});

beforeExit(function(){
calls.should.equal(1);
});
},

'test #sendfile(path, options, callback)': function(beforeExit){
