
var express = require('..');
var request = require('supertest');
var tmpl = require('./support/tmpl');

describe('res', function(){
describe('.render(name)', function(){
it('should support absolute paths', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render(__dirname + '/fixtures/user.tmpl');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should support absolute paths with "view engine"', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };
app.set('view engine', 'tmpl');

app.use(function(req, res){
res.render(__dirname + '/fixtures/user');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should error without "view engine" set and no file extension', function (done) {
var app = createApp();

app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render(__dirname + '/fixtures/user');
});

request(app)
.get('/')
.expect(500, /No default engine was specified/, done);
