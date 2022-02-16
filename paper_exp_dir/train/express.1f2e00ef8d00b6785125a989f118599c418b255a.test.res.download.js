
var express = require('../')
, request = require('supertest')
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
.expect('Content-Type', 'text/html; charset=UTF-8')
.expect('Content-Disposition', 'attachment; filename="user.html"')
.expect(200, '<p>{{user.name}}</p>', done)
})
})

describe('.download(path, filename)', function(){
it('should provide an alternate filename', function(done){
var app = express();

