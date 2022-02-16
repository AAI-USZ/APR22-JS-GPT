
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(null);
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('');
done();
})
})
})

describe('.send(undefined)', function(){
it('should set body to ""', function(done){
var app = express();
