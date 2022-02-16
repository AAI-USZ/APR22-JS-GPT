
var express = require('../')
, request = require('./support/http')
, utils = require('../lib/utils')
, assert = require('assert');

var app = express();

app.use(function(req, res, next){
res.format({
'text/plain': function(){
res.send('hey');
},

'text/html': function(){
res.send('<p>hey</p>');
},

'application/json': function(a, b, c){
assert(req == a);
assert(res == b);
assert(next == c);
res.send({ message: 'hey' });
}
});
});

app.use(function(err, req, res, next){
if (!err.types) throw err;
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app2 = express();

app2.use(function(req, res, next){
res.format({
text: function(){ res.send('hey') },
html: function(){ res.send('<p>hey</p>') },
json: function(){ res.send({ message: 'hey' }) }
});
});

app2.use(function(err, req, res, next){
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

describe('req', function(){
describe('.format(obj)', function(){
describe('with canonicalized mime types', function(){
test(app);
})

describe('with extnames', function(){
test(app2);
})
})
})

function test(app) {
it('should utilize qvalues in negotiation', function(done){
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/json, */*; q=.1')
.expect('{"message":"hey"}', done);
})

it('should allow wildcard type/subtypes', function(done){
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, application/*, */*; q=.1')
.expect('{"message":"hey"}', done);
})

it('should default the Content-Type', function(done){
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, text/plain')
.end(function(res){
res.headers['content-type'].should.equal('text/plain');
res.body.should.equal('hey');
done();
});
})

