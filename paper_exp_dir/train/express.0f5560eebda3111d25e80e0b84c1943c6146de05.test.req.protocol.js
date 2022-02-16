
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.protocol', function(){
it('should return the protocol string', function(done){
var app = express();

app.use(function(req, res){
res.end(req.protocol);
});

request(app)
.get('/')
.expect('http', done);
})

describe('when "trust proxy" is enabled', function(){
it('should respect X-Forwarded-Proto', function(done){
var app = express();

app.enable('trust proxy');

app.use(function(req, res){
