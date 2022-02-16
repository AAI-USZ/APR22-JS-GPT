
var express = require('../')
, request = require('./support/http')
, bodyParser = require('body-parser')

describe('req', function(){
describe('.param(name, default)', function(){
it('should use the default value unless defined', function(done){
var app = express();

app.use(function(req, res){
res.end(req.param('name', 'tj'));
