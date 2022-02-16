
var express = require('../')
, request = require('supertest');

describe('res', function(){
describe('.locals', function(){
it('should be empty by default', function(done){
var app = express();

app.use(function(req, res){
res.json(res.locals)
});

request(app)
.get('/')
.expect(200, {}, done)
})
})

it('should work when mounted', function(done){
var app = express();
