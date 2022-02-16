
var express = require('..');
var path = require('path')
var request = require('supertest');
var tmpl = require('./support/tmpl');

describe('res', function(){
describe('.render(name)', function(){
it('should support absolute paths', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render(path.join(__dirname, 'fixtures', 'user.tmpl'))
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
res.render(path.join(__dirname, 'fixtures', 'user'))
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should error without "view engine" set and file extension to a non-engine module', function (done) {
var app = createApp()

app.locals.user = { name: 'tobi' }

app.use(function (req, res) {
res.render(path.join(__dirname, 'fixtures', 'broken.send'))
})

request(app)
.get('/')
.expect(500, /does not provide a view engine/, done)
})

it('should error without "view engine" set and no file extension', function (done) {
var app = createApp();

app.locals.user = { name: 'tobi' };

