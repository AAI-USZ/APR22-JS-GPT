
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.download(path)', function(){
it('should transfer as an attachment', function(done){
var app = express();

app.use(function(req, res){
res.download('test/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
res.should.have.header('Content-Type', 'text/html; charset=UTF-8');
res.should.have.header('Content-Disposition', 'attachment; filename="user.html"');
res.body.should.equal('<p>{{user.name}}</p>');
done();
});
})
})

describe('.download(path, filename)', function(){
it('should provide an alternate filename', function(done){
var app = express();

app.use(function(req, res){
