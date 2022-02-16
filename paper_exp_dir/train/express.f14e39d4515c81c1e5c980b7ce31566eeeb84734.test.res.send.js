
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(null);
});

request(app)
.get('/')
.expect('', done);
})
})

describe('.send(undefined)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(undefined);
});

request(app)
.get('/')
.expect('', done);
})
})

describe('.send(code)', function(){
it('should set .statusCode', function(done){
var app = express();

app.use(function(req, res){
res.send(201).should.equal(res);
});

request(app)
.get('/')
.expect('Created')
.expect(201, done);
})
})

describe('.send(code, body)', function(){
it('should set .statusCode and body', function(done){
var app = express();

app.use(function(req, res){
res.send(201, 'Created :)');
});

request(app)
.get('/')
.expect('Created :)')
.expect(201, done);
})
})

describe('.send(body, code)', function(){
it('should be supported for backwards compat', function(done){
var app = express();

app.use(function(req, res){
res.send('Bad!', 400);
});

request(app)
.get('/')
.expect('Bad!')
.expect(400, done);
})
})

describe('.send(String)', function(){
it('should send as html', function(done){
var app = express();

app.use(function(req, res){
res.send('<p>hey</p>');
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/html; charset=utf-8');
res.text.should.equal('<p>hey</p>');
res.statusCode.should.equal(200);
done();
})
})

it('should set ETag', function(done){
var app = express();

app.use(function(req, res){
var str = Array(1024 * 2).join('-');
res.send(str);
});

request(app)
.get('/')
.expect('ETag', '"-1498647312"')
.end(done);
})

it('should not set ETag for non-GET/HEAD', function(done){
var app = express();

app.use(function(req, res){
var str = Array(1024 * 2).join('-');
res.send(str);
});

request(app)
.post('/')
.end(function(err, res){
if (err) return done(err);
assert(!res.header.etag, 'has an ETag');
done();
});
})

it('should not override Content-Type', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/plain').send('hey');
});

request(app)
.get('/')
.expect('Content-Type', 'text/plain; charset=utf-8')
.expect(200, 'hey', done);
})

it('should override charset in Content-Type', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/plain; charset=iso-8859-1').send('hey');
});
