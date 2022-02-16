
var express = require('../')
, request = require('./support/http')
, utils = require('connect').utils
, cookie = require('cookie');

describe('res', function(){
describe('.cookie(name, object)', function(){
it('should generate a JSON cookie', function(done){
var app = express();

app.use(function(req, res){
res.cookie('user', { name: 'tobi' }).end();
