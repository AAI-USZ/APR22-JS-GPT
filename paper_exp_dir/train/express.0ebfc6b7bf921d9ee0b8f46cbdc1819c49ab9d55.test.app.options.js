
var express = require('../')
, request = require('supertest');

describe('OPTIONS', function(){
it('should default to the routes defined', function(done){
var app = express();

app.del('/', function(){});
app.get('/users', function(req, res){});
app.put('/users', function(req, res){});

request(app)
.options('/users')
.expect('GET,PUT')
.expect('Allow', 'GET,PUT', done);
})

it('should not be affected by app.all', function(done){
var app = express();

app.get('/', function(){});
app.get('/users', function(req, res){});
app.put('/users', function(req, res){});
app.all('/users', function(req, res, next){
res.setHeader('x-hit', '1');
next();
});

request(app)
