
var express = require('../');
var request = require('supertest');
var assert = require('assert');

describe('HEAD', function(){
it('should default to GET', function(done){
var app = express();

app.get('/tobi', function(req, res){

res.send('tobi');
});

request(app)
.head('/tobi')
.expect(200, done);
})

it('should output the same headers as GET requests', function(done){
var app = express();

app.get('/tobi', function(req, res){

res.send('tobi');
});

request(app)
