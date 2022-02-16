
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path, fn)', function(){
it('should invoke the callback when complete', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', done)
});

request(app)
.get('/')
.expect(200)
.end(function(){});
})

it('should utilize the same options as express.static()', function(done){
