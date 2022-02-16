
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

app.use(function(req, res){
res.send(undefined);
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('');
done();
})
})
})

describe('.send(code)', function(){
it('should set .statusCode', function(done){
var app = express();

app.use(function(req, res){
res.send(201).should.equal(res);
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('Created');
res.statusCode.should.equal(201);
done();
})
})
})

describe('.send(code, body)', function(){
it('should set .statusCode and body', function(done){
var app = express();

app.use(function(req, res){
res.send(201, 'Created :)');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('Created :)');
res.statusCode.should.equal(201);
done();
})
})
})

describe('.send(body, code)', function(){
it('should be supported for backwards compat', function(done){
var app = express();

app.use(function(req, res){
res.send('Bad!', 400);
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('Bad!');
res.statusCode.should.equal(400);
done();
})
})
})

describe('.send(String)', function(){
it('should send as html', function(done){
var app = express();
