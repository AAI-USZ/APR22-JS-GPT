
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
it('should restore req.params after leaving router', function(done){
var app = express();
var router = new express.Router();

function handler1(req, res, next){
res.setHeader('x-user-id', req.params.id);
next()
}

function handler2(req, res){
res.send(req.params.id);
}

router.use(function(req, res, next){
res.setHeader('x-router', req.params.id);
next();
});

app.get('/user/:id', handler1, router, handler2);

request(app)
.get('/user/1')
.expect('x-router', 'undefined')
.expect('x-user-id', '1')
.expect(200, '1', done);
})

describe('methods', function(){
methods.concat('del').forEach(function(method){
if (method === 'connect') return;

it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
res.end();
} else {
res.end(method);
}
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})

it('should reject numbers for app.' + method, function(){
var app = express();
app[method].bind(app, '/', 3).should.throw(/Number/);
})
});

it('should re-route when method is altered', function (done) {
var app = express();
var cb = after(3, done);

app.use(function (req, res, next) {
if (req.method !== 'POST') return next();
req.method = 'DELETE';
res.setHeader('X-Method-Altered', '1');
next();
});

app.delete('/', function (req, res) {
res.end('deleted everything');
});

request(app)
.get('/')
.expect(404, 'Cannot GET /\n', cb);

request(app)
.delete('/')
.expect(200, 'deleted everything', cb);

request(app)
.post('/')
.expect('X-Method-Altered', '1')
.expect(200, 'deleted everything', cb);
});
})

describe('decode querystring', function(){
it('should decode correct params', function(done){
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo%2Fbar')
.expect('foo/bar', done);
})

it('should not accept params in malformed paths', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/%foobar')
.expect(400, done);
})

it('should not decode spaces', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo+bar')
.expect('foo+bar', done);
})

it('should work with unicode', function(done) {
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/%ce%b1')
.expect('\u03b1', done);
})
})

it('should be .use()able', function(done){
var app = express();

var calls = [];

app.use(function(req, res, next){
calls.push('before');
next();
});

app.get('/', function(req, res, next){
calls.push('GET /')
next();
});

app.use(function(req, res, next){
calls.push('after');
res.end();
});

request(app)
.get('/')
.end(function(res){
calls.should.eql(['before', 'GET /', 'after'])
done();
})
})

describe('when given a regexp', function(){
it('should match the pathname only', function(done){
var app = express();

app.get(/^\/user\/[0-9]+$/, function(req, res){
res.end('user');
});

request(app)
.get('/user/12?foo=bar')
.expect('user', done);
})

it('should populate req.params with the captures', function(done){
var app = express();

app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, function(req, res){
var id = req.params[0]
, op = req.params[1];
res.end(op + 'ing user ' + id);
});

request(app)
.get('/user/10/edit')
.expect('editing user 10', done);
})
})

describe('case sensitivity', function(){
it('should be disabled by default', function(done){
var app = express();

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/USER')
.expect('tj', done);
})

describe('when "case sensitive routing" is enabled', function(){
it('should match identical casing', function(done){
var app = express();

app.enable('case sensitive routing');

app.get('/uSer', function(req, res){
res.end('tj');
});

request(app)
.get('/uSer')
.expect('tj', done);
})

it('should not match otherwise', function(done){
var app = express();

app.enable('case sensitive routing');

app.get('/uSer', function(req, res){
res.end('tj');
});

request(app)
.get('/user')
.expect(404, done);
})
})
})

describe('params', function(){
it('should overwrite existing req.params by default', function(done){
var app = express();
var router = new express.Router();

router.get('/:action', function(req, res){
res.send(req.params);
});

app.use('/user/:user', router);

request(app)
.get('/user/1/get')
.expect(200, '{"action":"get"}', done);
})

it('should allow merging existing req.params', function(done){
var app = express();
var router = new express.Router({ mergeParams: true });

router.get('/:action', function(req, res){
var keys = Object.keys(req.params).sort();
res.send(keys.map(function(k){ return [k, req.params[k]] }));
});

app.use('/user/:user', router);

request(app)
.get('/user/tj/get')
.expect(200, '[["action","get"],["user","tj"]]', done);
})

it('should use params from router', function(done){
var app = express();
var router = new express.Router({ mergeParams: true });

router.get('/:thing', function(req, res){
var keys = Object.keys(req.params).sort();
res.send(keys.map(function(k){ return [k, req.params[k]] }));
});

app.use('/user/:thing', router);

request(app)
.get('/user/tj/get')
.expect(200, '[["thing","get"]]', done);
})

it('should merge numeric indices req.params', function(done){
var app = express();
var router = new express.Router({ mergeParams: true });

router.get('/*.*', function(req, res){
var keys = Object.keys(req.params).sort();
res.send(keys.map(function(k){ return [k, req.params[k]] }));
});

app.use('/user/id:(\\d+)', router);

request(app)
.get('/user/id:10/profile.json')
.expect(200, '[["0","10"],["1","profile"],["2","json"]]', done);
})

it('should merge numeric indices req.params when more in parent', function(done){
var app = express();
var router = new express.Router({ mergeParams: true });

router.get('/*', function(req, res){
var keys = Object.keys(req.params).sort();
res.send(keys.map(function(k){ return [k, req.params[k]] }));
});

app.use('/user/id:(\\d+)/name:(\\w+)', router);

request(app)
.get('/user/id:10/name:tj/profile')
.expect(200, '[["0","10"],["1","tj"],["2","profile"]]', done);
})

it('should ignore invalid incoming req.params', function(done){
var app = express();
var router = new express.Router({ mergeParams: true });

router.get('/:name', function(req, res){
var keys = Object.keys(req.params).sort();
res.send(keys.map(function(k){ return [k, req.params[k]] }));
});

app.use('/user/', function (req, res, next) {
req.params = 3;
router(req, res, next);
});

request(app)
.get('/user/tj')
.expect(200, '[["name","tj"]]', done);
})
})

describe('trailing slashes', function(){
it('should be optional by default', function(done){
var app = express();

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/user/')
.expect('tj', done);
})

describe('when "strict routing" is enabled', function(){
it('should match trailing slashes', function(done){
var app = express();

app.enable('strict routing');

app.get('/user/', function(req, res){
res.end('tj');
});

request(app)
.get('/user/')
.expect('tj', done);
})

it('should pass-though middleware', function(done){
var app = express();

app.enable('strict routing');

app.use(function (req, res, next) {
res.setHeader('x-middleware', 'true');
next();
});

app.get('/user/', function(req, res){
res.end('tj');
});

request(app)
