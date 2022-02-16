
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.param(name, default)', function(){
it('should use the default value unless defined', function(done){
var app = express();

app.use(function(req, res){
res.end(req.param('name', 'tj'));
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('tj');
done();
})
})
})

describe('.param(name)', function(){
it('should check req.query', function(done){
var app = express();

app.use(function(req, res){
res.end(req.param('name'));
});

request(app)
.get('/?name=tj')
