
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.stale', function(){
it('should return false when the resource is not modified', function(done){
var app = express();
var etag = '"12345"';

app.use(function(req, res){
res.set('ETag', etag);
res.send(req.stale);
});

request(app)
.get('/')
.set('If-None-Match', etag)
