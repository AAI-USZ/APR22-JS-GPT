
var express = require('../')
, request = require('supertest');

describe('res', function(){
describe('.redirect(url)', function(){
it('should default to a 302 redirect', function(done){
var app = express();

app.use(function(req, res){
res.redirect('http://google.com');
});

request(app)
.get('/')
.expect('location', 'http://google.com')
.expect(302, done)
})
})

describe('.redirect(status, url)', function(){
it('should set the response status', function(done){
var app = express();

app.use(function(req, res){
