
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.sendfile(path)', function(){
describe('with an absolute path', function(){
it('should transfer the file', function(done){
var app = express();

app.use(function(req, res){
