
var assert = require('assert');
var express = require('..');
var methods = require('methods');
var request = require('supertest');

describe('res', function(){
describe('.send()', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send();
});

request(app)
.get('/')
.expect(200, '', done);
})
})

describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
