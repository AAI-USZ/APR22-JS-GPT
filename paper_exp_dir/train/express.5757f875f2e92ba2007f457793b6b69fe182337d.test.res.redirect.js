
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.redirect(url)', function(){
it('should respect X-Forwarded-Proto', function(done){
var app = express();

app.use(function(req, res){
res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')
.set('X-Forwarded-Proto', 'https')
.end(function(res){
res.statusCode.should.equal(302);
res.headers.should.have.property('location', 'https://example.com/login');
done();
})
})
