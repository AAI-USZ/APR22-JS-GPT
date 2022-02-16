
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.sendfile(path)', function(){
it('should transfer the file', function(done){
var app = express();

app.use(function(req, res){
res.sendfile(__dirname + '/fixtures/user.html');
});

request(app)
.get('/')
.end(function(res){
