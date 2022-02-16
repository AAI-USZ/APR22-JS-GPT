
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
res.text.should.equal('typeof something === \'function\' && something({"count":1});');
done();
})
})

it('should use first callback parameter with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback=something&callback=somethingelse')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('typeof something === \'function\' && something({"count":1});');
done();
})
})

it('should ignore object callback parameter with jsonp', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ count: 1 });
});

request(app)
.get('/?callback[a]=something')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('{"count":1}');
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
res.text.should.equal('typeof something === \'function\' && something({"count":1});');
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
res.text.should.equal('typeof callbacks[123] === \'function\' && callbacks[123]({"count":1});');
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
res.text.should.equal('typeof foobar === \'function\' && foobar({});');
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
res.headers.should.have.property('content-type', 'text/javascript; charset=utf-8');
res.text.should.equal('typeof foo === \'function\' && foo({"str":"\\u2028 \\u2029 woot"});');
done();
});
});

describe('when given primitives', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.jsonp(null);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('null');
done();
})
})
})

describe('when given an array', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.jsonp(['foo', 'bar', 'baz']);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('["foo","bar","baz"]');
done();
})
})
})

describe('when given an object', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.jsonp({ name: 'tobi' });
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('{"name":"tobi"}');
done();
})
})
})

describe('when given primitives', function(){
it('should respond with json for null', function(done){
var app = express();

app.use(function(req, res){
res.jsonp(null);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
