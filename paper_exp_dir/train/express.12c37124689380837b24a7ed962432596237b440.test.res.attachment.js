
var Buffer = require('safe-buffer').Buffer
var express = require('../')
, request = require('supertest');

describe('res', function(){
describe('.attachment()', function(){
it('should Content-Disposition to attachment', function(done){
var app = express();

app.use(function(req, res){
