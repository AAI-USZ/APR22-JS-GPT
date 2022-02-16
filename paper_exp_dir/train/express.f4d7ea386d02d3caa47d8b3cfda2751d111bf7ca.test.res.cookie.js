
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.cookie(name, value)', function(){
it('should set a cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi').end();
});

request(app)
.get('/')
.end(function(res){
var val = ['name=tobi; path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})

it('should default path to "root"', function(done){
var app = express();

app.set('root', '/admin');

app.use(function(req, res){
res.cookie('name', 'tobi').end();
});

request(app)
.get('/')
.end(function(res){
var val = ['name=tobi; path=/admin'];
res.headers['set-cookie'].should.eql(val);
done();
})
})

it('should allow multiple calls', function(done){
