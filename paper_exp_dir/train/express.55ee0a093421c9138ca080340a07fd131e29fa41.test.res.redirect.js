
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.redirect(url)', function(){
it('should default to a 302 redirect', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.get('/')
.end(function(res){
res.statusCode.should.equal(302);
res.headers.should.have.property('location', 'http://google.com');
done();
})
})

describe('when relative', function(){
it('should construct an absolute url', function(done){
var app = express();

app.use(function(req, res){
res.redirect('/login');
});

request(app)
