
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('req', function(){
describe('.get(field)', function(){
it('should return the header field value', function(done){
var app = express();

app.use(function(req, res){
assert(req.get('Something-Else') === undefined);
res.end(req.get('Content-Type'));
});

request(app)
.post('/')
.set('Content-Type', 'application/json')
.expect('application/json', done);
})

it('should special-case Referer', function(done){
var app = express();

app.use(function(req, res){
res.end(req.get('Referer'));
});

request(app)
