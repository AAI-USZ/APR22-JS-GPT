
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.render(name)', function(){
it('should support absolute paths', function(done){
var app = express();

app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render(__dirname + '/fixtures/user.jade');
});

request(app)
.get('/')
.end(function(res){
