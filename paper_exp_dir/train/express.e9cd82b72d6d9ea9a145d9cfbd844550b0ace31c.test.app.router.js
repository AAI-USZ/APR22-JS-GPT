var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
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
});
})

it('should decode params', function(done){
var app = express();

app.get('/:name', function(req, res, next){
res.send(req.params.name);
});

request(app)
.get('/foo%2Fbar')
.expect('foo/bar', done);
})

it('should be .use()able', function(done){
var app = express();

var calls = [];

app.use(function(req, res, next){
calls.push('before');
next();
});

app.use(app.router);

app.use(function(req, res, next){
calls.push('after');
res.end();
});

app.get('/', function(req, res, next){
calls.push('GET /')
next();
});

request(app)
.get('/')
.end(function(res){
calls.should.eql(['before', 'GET /', 'after'])
done();
})
})

it('should be auto .use()d on the first app.VERB() call', function(done){
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
var id = req.params.shift()
, op = req.params.shift();
res.end(op + 'ing user ' + id);
});

request(app)
.get('/user/10/edit')
.expect('editing user 10', done);
})
})

describe('when given an array', function(){
it('should match all paths in the array', function(done){
var app = express();

app.get(['/one', '/two'], function(req, res){
res.end('works');
});

request(app)
.get('/one')
.expect('works', function() {
request(app)
.get('/two')
.expect('works', done);
});
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

it('should match no slashes', function(done){
var app = express();

app.enable('strict routing');

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/user')
.expect('tj', done);
})

it('should fail when omitting the trailing slash', function(done){
var app = express();

app.enable('strict routing');

app.get('/user/', function(req, res){
res.end('tj');
});

request(app)
.get('/user')
.expect(404, done);
})

it('should fail when adding the trailing slash', function(done){
var app = express();

app.enable('strict routing');

app.get('/user', function(req, res){
res.end('tj');
});

request(app)
.get('/user/')
.expect(404, done);
})
})
})

it('should allow escaped regexp', function(done){
var app = express();

app.get('/user/\\d+', function(req, res){
res.end('woot');
});

request(app)
.get('/user/10')
.end(function(res){
res.statusCode.should.equal(200);
request(app)
.get('/user/tj')
.expect(404, done);
});
})

it('should allow literal "."', function(done){
var app = express();

app.get('/api/users/:from..:to', function(req, res){
var from = req.params.from
, to = req.params.to;

res.end('users from ' + from + ' to ' + to);
});

request(app)
.get('/api/users/1..50')
.expect('users from 1 to 50', done);
})

describe('*', function(){
it('should denote a greedy capture group', function(done){
var app = express();

app.get('/user/*.json', function(req, res){
res.end(req.params[0]);
});

request(app)
.get('/user/tj.json')
.expect('tj', done);
})

it('should work with several', function(done){
var app = express();

app.get('/api/*.*', function(req, res){
var resource = req.params.shift()
, format = req.params.shift();
res.end(resource + ' as ' + format);
});

request(app)
.get('/api/users/foo.bar.json')
.expect('users/foo.bar as json', done);
})

it('should work cross-segment', function(done){
var app = express();

app.get('/api*', function(req, res){
res.send(req.params[0]);
});

request(app)
.get('/api')
.expect('', function(){
request(app)
.get('/api/hey')
