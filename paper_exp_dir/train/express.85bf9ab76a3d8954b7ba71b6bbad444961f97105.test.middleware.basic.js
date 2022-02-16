
var express = require('../');
var request = require('supertest');

describe('middleware', function(){
describe('.next()', function(){
it('should behave like connect', function(done){
var app = express()
, calls = [];

app.use(function(req, res, next){
calls.push('one');
next();
