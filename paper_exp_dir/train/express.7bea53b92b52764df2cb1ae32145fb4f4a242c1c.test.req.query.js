
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.query', function(){
it('should default to {}', function(done){
var app = createApp();

request(app)
.get('/')
.expect(200, '{}', done);
});

it('should default to parse complex keys', function (done) {
var app = createApp();

request(app)
.get('/?user[name]=tj')
.expect(200, '{"user":{"name":"tj"}}', done);
});

describe('when "query parser" is extended', function () {
it('should parse complex keys', function (done) {
var app = createApp('extended');

request(app)
.get('/?user[name]=tj')
.expect(200, '{"user":{"name":"tj"}}', done);
});

it('should parse parameters with dots', function (done) {
var app = createApp('extended');

request(app)
.get('/?user.name=tj')
.expect(200, '{"user.name":"tj"}', done);
});
});

