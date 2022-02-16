
var express = require('../')
, request = require('./support/http');

describe('res', function(){
var app = express();

app.use(function(req, res){
Object.keys(res.locals).should.eql([]);
