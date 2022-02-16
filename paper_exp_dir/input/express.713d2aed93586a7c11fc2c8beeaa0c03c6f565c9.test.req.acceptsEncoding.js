
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.acceptsEncoding', function(){
it('should be true if encoding accepted', function(done){
var app = express();

app.use(function(req, res){
res.end();
});

request(app)
.get('/')
.set('Accept-Encoding', ' gzip, deflate')
.expect(200, done);
})

it('should be false if encoding not accepted', function(done){
var app = express();

app.use(function(req, res){
