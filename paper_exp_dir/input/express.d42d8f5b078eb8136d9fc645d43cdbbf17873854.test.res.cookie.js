
var express = require('../')
, request = require('./support/http')
, mixin = require('utils-merge')
, cookie = require('cookie')
, cookieParser = require('cookie-parser')

describe('res', function(){
describe('.cookie(name, object)', function(){
it('should generate a JSON cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('user', { name: 'tobi' }).end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['user=' + encodeURIComponent('j:{"name":"tobi"}') + '; Path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})
})

describe('.cookie(name, string)', function(){
it('should set a cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi').end();
});

request(app)
.get('/')
.end(function(err, res){
var val = ['name=tobi; Path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})

it('should allow multiple calls', function(done){
var app = express();

app.use(function(req, res){
res.cookie('name', 'tobi');
res.cookie('age', 1);
