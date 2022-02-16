
var express = require('../')
, request = require('supertest')
, cookie = require('cookie')
, cookieParser = require('cookie-parser')
var merge = require('utils-merge');

describe('res', function(){
describe('.cookie(name, object)', function(){
it('should generate a JSON cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('user', { name: 'tobi' }).end();
});

request(app)
.get('/')
.expect('Set-Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D; Path=/')
.expect(200, done)
})
})

describe('.cookie(name, string)', function(){
it('should set a cookie', function(done){
var app = express();

app.use(function(req, res){
