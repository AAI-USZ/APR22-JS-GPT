
var express = require('../')
, request = require('./support/http');

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
