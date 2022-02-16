
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path, fn)', function(){
it('should invoke the callback when complete', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', function(err){
assert(!err);
done();
});
});

request(app)
.get('/')
.expect(200)
.end(function(){});
})

it('should utilize the same options as express.static()', function(done){
var app = express();

app.use(function(req, res){
res.sendfile('test/fixtures/user.html', { maxAge: 60000 });
});
