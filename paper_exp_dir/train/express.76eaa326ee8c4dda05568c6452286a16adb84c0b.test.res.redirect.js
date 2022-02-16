
var http = require('http');
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

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

it('should encode "url"', function (done) {
var app = express()

app.use(function (req, res) {
res.redirect('https://google.com?q=\u2603 §10')
})

request(app)
.get('/')
