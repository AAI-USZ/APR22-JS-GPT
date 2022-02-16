
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path, fn)', function(){
it('should invoke the callback when complete', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', done)
});

request(app)
.get('/')
.expect(200)
.end(function(){});
})

it('should utilize the same options as express.static()', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', { maxAge: 60000 });
});

request(app)
.get('/')
.expect('Cache-Control', 'public, max-age=60')
.end(done);
})

it('should invoke the callback on 404', function(done){
var app = express()
, calls = 0;

app.use(function(req, res){
res.sendfile('test/fixtures/nope.html', function(err){
++calls;
assert(!res.headersSent);
res.send(err.message);
});
});

request(app)
.get('/')
.end(function(err, res){
assert(1 == calls, 'called too many times');
res.text.should.startWith("ENOENT, stat");
res.statusCode.should.equal(200);
done();
});
})

it('should not override manual content-types', function(done){
var app = express();

app.use(function(req, res){
res.contentType('txt');
res.sendfile('test/fixtures/user.html');
});

request(app)
.get('/')
.expect('Content-Type', 'text/plain')
.end(done);
})

it('should invoke the callback on 403', function(done){
var app = express()
, calls = 0;

app.use(function(req, res){
res.sendfile('test/fixtures/foo/../user.html', function(err){
assert(!res.headersSent);
++calls;
res.send(err.message);
});
});

request(app)
.get('/')
.expect('Forbidden')
.expect(200, done);
})

it('should invoke the callback on socket error', function(done){
var app = express()
, calls = 0;

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', function(err){
assert(!res.headersSent);
req.socket.listeners('error').should.have.length(1);
done();
});

req.socket.emit('error', new Error('broken!'));
});

request(app)
.get('/')
.end(function(){});
})
})

describe('.sendfile(path)', function(){
it('should not serve dotfiles', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/.name');
});

request(app)
.get('/')
.expect(404, done);
})

it('should accept dotfiles option', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/.name', { dotfiles: 'allow' });
});

request(app)
.get('/')
.expect(200, 'tobi', done);
})

it('should transfer a file', function (done) {
var app = express();

app.use(function (req, res) {
res.sendfile('test/fixtures/name.txt');
});

request(app)
.get('/')
.expect(200, 'tobi', done);
