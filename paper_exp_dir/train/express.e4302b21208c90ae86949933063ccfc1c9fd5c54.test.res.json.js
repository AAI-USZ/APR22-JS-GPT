
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
it('should not support jsonp callbacks', function(done){
var app = express();

app.use(function(req, res){
res.json({ foo: 'bar' });
});

request(app)
.get('/?callback=foo')
.expect('{"foo":"bar"}', done);
})

it('should not override previous Content-Types', function(done){
var app = express();

app.get('/', function(req, res){
res.type('application/vnd.example+json');
res.json({ hello: 'world' });
});

request(app)
.get('/')
.expect('Content-Type', 'application/vnd.example+json')
.expect(200, '{"hello":"world"}', done);
})

