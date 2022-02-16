
var express = require('../')
, request = require('./support/http')
, res = express.response;

describe('res', function(){
describe('.set(field, value)', function(){
it('should set the response header field', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/x-foo').end();
