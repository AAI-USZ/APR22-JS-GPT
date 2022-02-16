
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.xhr', function(){
it('should return true when X-Requested-With is xmlhttprequest', function(done){
var app = express();

app.use(function(req, res){
req.xhr.should.be.true;
res.end();
});

request(app)
.get('/')
.set('X-Requested-With', 'xmlhttprequest')
.expect(200)
.end(function(err, res){
done(err);
})
})

it('should case-insensitive', function(done){
var app = express();

app.use(function(req, res){
req.xhr.should.be.true;
