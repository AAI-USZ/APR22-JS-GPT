
var express = require('../')
, request = require('./support/http')
, utils = require('../lib/utils');

var app = express();

app.use(function(req, res, next){
res.respondTo({
'text/plain': function(){
res.send('hey');
},

'text/html': function(){
res.send('<p>hey</p>');
},

'appliation/json': function(){
res.send({ message: 'hey' });
}
});
});

app.use(function(err, req, res, next){
res.send(406, 'Supports: ' + err.types.join(', '));
})

describe('req', function(){
describe('.respondTo(obj)', function(){
it('should utilize qvalues in negotiation', function(done){
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, appliation/json, */*; q=.1')
.expect('{"message":"hey"}', done);
})

it('should allow wildcard type/subtypes', function(done){
request(app)
.get('/')
.set('Accept', 'text/html; q=.5, appliation/*, */*; q=.1')
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
