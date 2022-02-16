
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.cookie(name, object)', function(){
it('should generate a JSON cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('user', { name: 'tobi' }).end();
});

request(app)
.get('/')
.end(function(res){
var val = ['user=j%3A%7B%22name%22%3A%22tobi%22%7D; path=/'];
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
.end(function(res){
var val = ['name=tobi; path=/'];
res.headers['set-cookie'].should.eql(val);
done();
})
})














