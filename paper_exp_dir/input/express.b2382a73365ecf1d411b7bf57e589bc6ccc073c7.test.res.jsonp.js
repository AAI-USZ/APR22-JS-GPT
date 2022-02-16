
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.jsonp(object)', function(){
it('should respond with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=something')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /something\(\{"count":1\}\);/, done);
})

it('should use first callback parameter with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=something&callback=somethingelse')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /something\(\{"count":1\}\);/, done);
})

it('should ignore object callback parameter with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback[a]=something')
.expect('Content-Type', 'application/json; charset=utf-8')
.expect(200, '{"count":1}', done)
})

it('should allow renaming callback', function(done){
var app = express();

app.set('jsonp callback name', 'clb');

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?clb=something')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /something\(\{"count":1\}\);/, done);
})

it('should allow []', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=callbacks[123]')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /callbacks\[123\]\(\{"count":1\}\);/, done);
})

it('should disallow arbitrary js', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({});
});

request(app)
.get('/?callback=foo;bar()')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /foobar\(\{\}\);/, done);
})

it('should escape utf whitespace', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ str: '\u2028 \u2029 woot' });
});

request(app)
.get('/?callback=foo')
.expect('Content-Type', 'text/javascript; charset=utf-8')
.expect(200, /foo\(\{"str":"\\u2028 \\u2029 woot"\}\);/, done);
});

var app = express();

app.use(function(req, res){
});

request(app)
