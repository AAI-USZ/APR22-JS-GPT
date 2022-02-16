
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.subdomains', function(){
describe('when present', function(){
it('should return an array', function(done){
var app = express();

app.use(function(req, res){
res.send(req.subdomains);
});

request(app)
.get('/')
.set('Host', 'tobi.ferrets.example.com')
.expect(["ferrets","tobi"], done);
})

it('should work with IPv4 address', function(done){
var app = express();

app.use(function(req, res){
res.send(req.subdomains);
});

request(app)
.get('/')
