
var express = require('../')
, request = require('./support/http');

describe('req', function(){
it('should return the header field value', function(done){
var app = express();

app.use(function(req, res){
});

request(app)
.post('/')
.set('Content-Type', 'application/json')
.end(function(res){
res.body.should.equal('application/json');
done();
});
})

it('should special-case Referer', function(done){
var app = express();

app.use(function(req, res){
