
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
})

it('should not respond if the path is not defined', function(done){
var app = express();

app.get('/users', function(req, res){});

request(app)
.options('/other')
.expect(404, done);
})

it('should forward requests down the middleware chain', function(done){
var app = express();
var router = new express.Router();

router.get('/users', function(req, res){});
app.use(router.middleware);
app.get('/other', function(req, res){});

request(app)
.options('/other')
