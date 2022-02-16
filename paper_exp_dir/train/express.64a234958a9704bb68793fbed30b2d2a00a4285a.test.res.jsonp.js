
var express = require('../')
, request = require('./support/http')
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
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something && something({"count":1});');
done();
})
})

it('should allow renaming callback', function(done){
var app = express();

app.set('jsonp callback name', 'clb');

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?clb=something')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('something && something({"count":1});');
done();
})
})

it('should allow []', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=callbacks[123]')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('callbacks[123] && callbacks[123]({"count":1});');
done();
})
})

it('should disallow arbitrary js', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({});
});

request(app)
.get('/?callback=foo;bar()')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('foobar && foobar({});');
done();
})
})

it('should escape utf whitespace', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ str: '\u2028 \u2029 woot' });
});

request(app)
.get('/?callback=foo')
.end(function(err, res){
