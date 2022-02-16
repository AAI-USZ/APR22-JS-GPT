


var express = require('express'),
connect = require('connect'),
view = require('express/view');

view.helpers.reverse = function(str){
return str.split('').reverse().join('');
};

module.exports = {
'test #render()': function(assert){
var app = express.createServer(connect.errorHandler({ showMessage: true }));
app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});
app.get('/helpers', function(req, res){
res.render('helpers.jade', { layout: false });
});
app.get('/jade', function(req, res){
res.render('index', { layout: false });
});
app.get('/haml', function(req, res){
res.render('hello.haml', { layout: false });
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
app.get('/error', function(req, res){
res.render('invalid.jade', { layout: false }, function(err){
res.send(err.arguments[0]);
});
});

assert.response(app,
{ url: '/' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/helpers' },
{ body: '<p>esrever</p>' });
assert.response(app,
{ url: '/jade' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/haml' },
{ body: '\n<p>Hello World</p>' });
assert.response(app,
{ url: '/callback' },
{ body: '\n<p>:)</p>' });
assert.response(app,
{ url: '/error' },
{ body: 'doesNotExist' });
assert.response(app,
{ url: '/invalid' },
function(res){
assert.ok(res.body.indexOf('ReferenceError') >= 0);
assert.ok(res.body.indexOf('doesNotExist') >= 0);
});
},

'test #render() layout': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');
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

'test #render() specific layout': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');

app.get('/', function(req, res){
res.render('index.jade', { layout: 'cool-layout.jade' });
});
app.get('/no-ext', function(req, res){
res.render('index.jade', { layout: 'cool-layout' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
assert.response(app,
{ url: '/no-ext' },
{ body: '<cool><p>Welcome</p></cool>' });
},

'test #render() specific layout "view engine"': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index', { layout: 'cool-layout' });
});

assert.response(app,
{ url: '/' },
{ body: '<cool><p>Welcome</p></cool>' });
},

'test #partial()': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');


