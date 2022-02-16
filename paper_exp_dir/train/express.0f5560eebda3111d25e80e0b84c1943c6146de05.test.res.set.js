
var express = require('../')
, request = require('./support/http')
, res = express.response;

describe('res', function(){
describe('.set(field, value)', function(){
it('should set the response header field', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/x-foo').end();
});

request(app)
.get('/')
.expect('Content-Type', 'text/x-foo')
.end(done);
})

it('should coerce to a string', function(){
res.headers = {};
res.set('ETag', 123);
res.get('ETag').should.equal('123');
})
})
