
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.accepted', function(){
it('should return an array of accepted media types', function(done){
var app = express();

app.use(function(req, res){
req.accepted[0].value.should.equal('application/json');
req.accepted[1].value.should.equal('text/html');
res.end();
});

request(app)
.get('/')
.set('Accept', 'text/html;q=.5, application/json')
