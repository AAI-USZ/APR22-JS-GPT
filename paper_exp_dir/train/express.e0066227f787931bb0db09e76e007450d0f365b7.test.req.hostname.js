
var express = require('../')
, request = require('supertest')

describe('req', function(){
describe('.hostname', function(){
it('should return the Host when present', function(done){
var app = express();

app.use(function(req, res){
res.end(req.hostname);
});

